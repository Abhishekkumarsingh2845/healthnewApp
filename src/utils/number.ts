export const getRandomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const currencyFormatter =  (num:number) =>{
    function formatValue(divisor:number, unit:string) {
        let value = num / divisor;
        return Number.isInteger(value) ? value + unit : value.toFixed(2) + unit;
    }
    if (Math.abs(num) >= 1e7) {
        return formatValue(1e7, ' crore');
    } else if (Math.abs(num) >= 1e5) {
        return formatValue(1e5, ' lakh');
    }
    else {
        return num.toString();
    }
}