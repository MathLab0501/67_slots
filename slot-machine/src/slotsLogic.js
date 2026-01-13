export function spinReels() {
    return [
        Math.ceil(Math.random() * 7),
        Math.ceil(Math.random() * 7),
        Math.ceil(Math.random() * 7),
        Math.ceil(Math.random() * 7),
    ]
}

export function spinResult(amount, reelsResult) {
    let payout = 0;
    let multiplier = 0;
    let animation = null;

    if (
        reelsResult.length >= 4 &&
        reelsResult[0] === 6 &&
        reelsResult[1] === 7 &&
        reelsResult[2] === 6 &&
        reelsResult[3] === 7
    ) {
        return {
            payout: amount * 10,
            multiplier: 10,
            animation: "six-seven"
        };
    }

    for (let i = 0; i < reelsResult.length - 1; i++) {
        if (reelsResult[i] === 6 && reelsResult[i + 1] === 7) {
            return {
                payout: Math.floor(amount * 6.7),
                multiplier: 6.7,
                animation: "six-seven"
            };
        }
    }

    if (reelsResult[0] === reelsResult[3] && reelsResult[1] === reelsResult[2]) {
        return {
            payout: amount * 5,
            multiplier: 5,
            animation: null
        };
    }

    let count = 1;
    for (let i = 1; i < reelsResult.length; i++) {
        if (reelsResult[i] === reelsResult[0]) {
            count++;
        } else {
            break;
        }
    }

    if (count === 2) multiplier = 1;
    if (count === 3) multiplier = 2;
    if (count >= 4) multiplier = 3;

    if (multiplier > 0) {
        payout = amount * reelsResult[0] * multiplier * 0.5;
    }

    return {
        payout,
        multiplier,
        animation
    };
}