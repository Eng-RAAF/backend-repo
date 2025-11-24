import { PrismaClient } from '@prisma/client';

// Prisma Client reads DATABASE_URL from environment variable
let prisma;

try {
  // Configure Prisma for connection pooling (Supabase pooler)
  // For pooler connections, we need to handle prepared statement errors
  const prismaOptions = {
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: 'pretty',
  };

  prisma = new PrismaClient(prismaOptions);

  // Verify that the student model exists
  if (!prisma.student) {
    console.error('⚠ WARNING: Prisma Student model not found!');
    console.error('Please run: npm run prisma:generate');
    throw new Error('Prisma Client not properly generated. Run: npm run prisma:generate');
  }
} catch (error) {
  if (error.message.includes('Cannot find module') || error.message.includes('not properly generated')) {
    console.error('\n❌ Prisma Client Error:');
    console.error('The Prisma Client has not been generated.');
    console.error('Please run the following commands:');
    console.error('  1. npm run prisma:generate');
    console.error('  2. npm run prisma:migrate (or prisma:push)');
    console.error('\n');
    throw error;
  }
  throw error;
}

// Handle Prisma connection errors
prisma.$connect().catch((error) => {
  console.error('Failed to connect to database:', error.message);
  if (error.code === 'P1001') {
    console.error('\n❌ Database Connection Error (P1001)');
    console.error('Cannot reach database server. Possible solutions:');
    console.error('1. Check if your Supabase project is active (not paused)');
    console.error('2. Verify DATABASE_URL in .env file');
    console.error('3. For Supabase, use the DIRECT connection URL (not pooler)');
    console.error('4. Check network/firewall settings');
    console.error('5. See DATABASE_CONNECTION_FIX.md for detailed solutions\n');
  }
  // Don't exit in production, just log the error
  if (process.env.NODE_ENV === 'development') {
    console.error('Continuing in development mode...');
  }
});

// Create a wrapper to handle prepared statement errors
// This is a workaround for Supabase pooler connection issues
const createPrismaWithRetry = (client) => {
  return new Proxy(client, {
    get(target, prop) {
      const value = target[prop];
      
      // Wrap model access (student, class, etc.)
      if (prop && typeof value === 'object' && value !== null && !value.then) {
        return new Proxy(value, {
          get(modelTarget, modelProp) {
            const modelValue = modelTarget[modelProp];
            
            // Wrap async methods (findMany, create, etc.)
            if (typeof modelValue === 'function') {
              return async function(...args) {
                try {
                  return await modelValue.apply(modelTarget, args);
                } catch (error) {
                  // Check for prepared statement error (42P05)
                  if (error.message?.includes('prepared statement') || 
                      error.message?.includes('42P05') ||
                      (error.meta && error.meta.code === '42P05')) {
                    console.warn('Prepared statement error detected, reconnecting...');
                    try {
                      await target.$disconnect();
                      await new Promise(resolve => setTimeout(resolve, 100)); // Brief delay
                      await target.$connect();
                      // Retry the operation
                      return await modelValue.apply(modelTarget, args);
                    } catch (retryError) {
                      console.error('Retry failed:', retryError.message);
                      throw error; // Throw original error
                    }
                  }
                  throw error;
                }
              };
            }
            return modelValue;
          }
        });
      }
      
      // Wrap $queryRaw and other $ methods
      if (typeof value === 'function' && prop.startsWith('$')) {
        return async function(...args) {
          try {
            return await value.apply(target, args);
          } catch (error) {
            if (error.message?.includes('prepared statement') || 
                error.message?.includes('42P05') ||
                (error.meta && error.meta.code === '42P05')) {
              console.warn('Prepared statement error detected in $ method, reconnecting...');
              try {
                await target.$disconnect();
                await new Promise(resolve => setTimeout(resolve, 100));
                await target.$connect();
                return await value.apply(target, args);
              } catch (retryError) {
                console.error('Retry failed:', retryError.message);
                throw error;
              }
            }
            throw error;
          }
        };
      }
      
      return value;
    }
  });
};

// Wrap the prisma client with retry logic
prisma = createPrismaWithRetry(prisma);

export default prisma;

