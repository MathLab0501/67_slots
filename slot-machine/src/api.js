const BACKEND_URL = 'http://localhost:3001/api';

export const fetchWallet = async (userId) => {
    try {
        const response = await fetch(`${BACKEND_URL}/wallet/${userId}`);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('User not found. Please check your user ID.');
            }
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        return data.portefeuille;
    } catch (error) {
        throw error;
    }
};

export const performTransaction = async (won, userId, amount) => {
    try {
        const payload = {
            source: won ? 'GAME' : userId,
            destination: won ? userId : 'GAME',
            amount: amount
        };

        const response = await fetch(`${BACKEND_URL}/transaction`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Transaction failed: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};