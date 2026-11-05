function roundTo(value, decimals) {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

/**
 * Calculates measurements of ingredients needed for sourdough pie! (Assumes starter is at 100% hydration)
 * 
 * @param {number} n - Number of pies.
 * @param {string | number} size - Size of each pie, in string (e.g. 'small') or literal weight in grams (e.g. 280).
 * @param {float} hyd - Hydration of batch.
 * @param {float} starter - Amount of starter as a percentage of flour added.
 * @param {float} salt - Amount of salt as a percentage of flour added.
 * @param {float} breadFlour - Proportion of bread flour in total flour weight.
 * @param {number} levainStarter - Ratio of starter in levain.
 * @param {number} levainFlour - Ratio of flour added to starter for levain.
 * @param {number} levainWater - Ratio of water added to starter for levain.
 * @returns {object} Object containing all the measurements of relevant ingredients.
 */
export default function sourdoughPieCalc(
    n=3, 
    size='medium',
    hyd=0.7,
    salt=0.03,
    breadFlour=0.3,
    starter=0.15,
    // levainRatio='1:5:5'
    levainStarter=1,
    levainFlour=5,
    levainWater=5
) {
    // const [levainStarter, levainFlour, levainWater] = levainRatio.split(':').map((i) => parseInt(i));
    const levainTotalRatio = levainStarter + levainFlour + levainWater
    const levainFlourRatio = (0.5 * levainStarter + levainFlour) / levainTotalRatio;
    const levainWaterRatio = (0.5 * levainStarter + levainWater) / levainTotalRatio;

    const ballSize = size === "dog"    ? 100
                   : size === "small"  ? 220
                   : size === "medium" ? 270
                   : size === "large"  ? 300
                   : size;

    const totalWeight = n * ballSize;
    const totalFlour = totalWeight / (1 + hyd + salt);
    const totalBreadFlour = totalFlour * breadFlour;
    const totalPizzaFlour = totalFlour - totalBreadFlour;

    const totalWater = totalFlour * hyd;
    const totalSalt = roundTo(totalFlour * salt, 2);

    const flourAdded = totalFlour / (1 + levainFlourRatio * starter);    
    const totalLevain = flourAdded * starter;
    const levainFlourAdded = totalLevain * (levainFlour / levainTotalRatio);
    const waterAdded = totalWater - levainWaterRatio * totalLevain;

    let breadFlourAdded = 0;
    let pizzaFlourAdded = 0;

    const flourInLevain = levainFlourRatio * totalLevain;
    if (flourInLevain < totalBreadFlour) {
        breadFlourAdded = totalBreadFlour - flourInLevain;
        pizzaFlourAdded = totalPizzaFlour;
    } else {
        breadFlourAdded = 0
        pizzaFlourAdded = totalPizzaFlour - (flourInLevain - totalBreadFlour)
    }

    const starterAdded = totalLevain * levainStarter / levainTotalRatio;
    const levainWaterAdded = totalLevain * (levainWater / levainTotalRatio);
    
    const calories = 340 * totalFlour / 100 / n;

    // carbs, protein, fat, fibre, sugars and sodium
    const carbs = Math.round(0.74 * totalFlour / n);
    const protein = Math.round(0.12 * totalFlour / n);
    const fat = Math.round(0.01 * totalFlour / n);
    const fibre = Math.round(0.025 * totalFlour / n);
    const sugars = Math.round(0.015 * totalFlour / n);
    const sodium = Math.round(0.4 * totalSalt / n);

    return {
        totalWeight,
        saltAdded: totalSalt,
        starterAdded: Math.round(starterAdded),
        totalLevain:Math.round(totalLevain),
        levainFlourAdded: Math.round(levainFlourAdded),
        levainWaterAdded: Math.round(levainWaterAdded),
        breadFlourAdded: Math.round(breadFlourAdded),
        pizzaFlourAdded: Math.round(pizzaFlourAdded),
        waterAdded: Math.round(waterAdded),
        calories: Math.round(calories),
        carbs,
        protein, 
        fat,
        fibre,
        sugars,
        sodium
        // delta: (totalWeight - breadFlourAdded - pizzaFlourAdded - waterAdded - levainWaterAdded - levainFlourAdded - starterAdded - totalSalt)
    }
}

console.log(sourdoughPieCalc());
