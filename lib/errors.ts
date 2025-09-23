export function isPrismaInitializationError(error: unknown): error is Error {
  return error instanceof Error && error.name === "PrismaClientInitializationError";
}
