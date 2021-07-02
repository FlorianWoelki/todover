-- CreateTable
CREATE TABLE "Setting" (
    "id" SERIAL NOT NULL,
    "language" TEXT NOT NULL DEFAULT E'en',
    "userId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Setting" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
