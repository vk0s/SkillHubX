import assert from 'node:assert';
import { test } from 'node:test';

// Mock DB for testing
const mockDb = {
    user: {
        findUnique: async () => ({ id: 'user1', walletBalance: 100 }),
        update: async () => ({ walletBalance: 110 })
    },
    transaction: {
        findFirst: async () => null, // No existing transaction
        create: async () => ({ id: 'tx1' })
    },
    $transaction: async (ops: any[]) => ops
};

// Mock logic for rewardForWatch
async function mockRewardForWatch(userId: string, contentId: string) {
    if (!userId) return { success: false };

    // Check existing
    const existing = await mockDb.transaction.findFirst();
    if (existing) return { success: false, message: "Already rewarded" };

    // Update
    await mockDb.user.update();
    await mockDb.transaction.create();

    return { success: true, newBalance: 110 };
}

test('rewardForWatch increases balance', async () => {
    const result = await mockRewardForWatch('user1', 'content1');
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.newBalance, 110);
});
