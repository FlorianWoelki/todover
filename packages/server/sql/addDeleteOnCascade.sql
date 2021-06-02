ALTER TABLE "List"
DROP CONSTRAINT "List_userId_fkey",
ADD CONSTRAINT "List_userId_fkey"
   FOREIGN KEY ("userId")
   REFERENCES "User"(id)
   ON DELETE CASCADE;

ALTER TABLE "Todo"
DROP CONSTRAINT "Todo_userId_fkey",
ADD CONSTRAINT "Todo_userId_fkey"
   FOREIGN KEY ("userId")
   REFERENCES "User"(id)
   ON DELETE CASCADE;
