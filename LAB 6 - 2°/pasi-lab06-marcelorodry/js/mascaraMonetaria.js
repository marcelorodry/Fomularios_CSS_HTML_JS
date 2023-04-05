const args = {
    allowNegative: false,
    negativeSignAfter: false,
    prefix: '',
    suffix: '',
    fixed: true,
    fractionDigits: 2,
    decimalSeparator: ',',
    thousandsSeparator: '.',
    cursor: 'move'
};

const input = SimpleMaskMoney.setMask('#preco', args);

input.formatToNumber();

input.addEventListener('focus', () => {
    if (input.value.includes('R$ ')) {
        input.value = input.value.substr(3)
    }
    // Deixa o select sempre ao final do valor
    input.setSelectionRange(input.value.length, input.value.length)
})

input.addEventListener('blur', () => {
    if (!input.value.includes('R$ ')) {
        input.value = `R$ ${input.value}`
    }

})

document.querySelector('#preco').blur();