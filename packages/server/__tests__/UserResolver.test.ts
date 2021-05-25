import { User } from '.prisma/client';
import { MockContext, MyContext, createMockContext } from '../src/MyContext';

let mockCtx: MockContext;
let ctx: MyContext;

const createUser = async (user: User, ctx: MyContext) => {
  return await ctx.prisma.user.create({ data: user });
};

beforeEach(() => {
  mockCtx = createMockContext();
  ctx = (mockCtx as unknown) as MyContext;
});

test('should create new user', async () => {
  const user: User = {
    id: 1,
    email: 'test@test.de',
    password: '123',
    tokenVersion: 0,
  };

  mockCtx.prisma.user.create.mockResolvedValue(user);

  await expect(createUser(user, ctx)).resolves.toEqual({
    id: 1,
    email: 'test@test.de',
    password: '123',
    tokenVersion: 0,
  });
});
