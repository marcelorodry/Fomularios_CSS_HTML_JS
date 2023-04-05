export function valida(input) {
    const tipoDeInput = input.dataset.tipo

    if(validadores[tipoDeInput]) {
        validadores[tipoDeInput](input)
    }

    if(input.validity.valid) {
        input.parentElement.classList.remove('input-container--invalido')
        input.parentElement.querySelector('.input-mensagem-erro').innerHTML = ''
    } else {
        input.parentElement.classList.add('input-container--invalido')
        input.parentElement.querySelector('.input-mensagem-erro').innerHTML = mostraMensagemDeErro(tipoDeInput, input)
    }
}

const tiposDeErro = [
    'valueMissing',
    'typeMismatch',
    'patternMismatch',
    'customError'
]

const mensagensDeErro = {
    nome: {
        valueMissing: 'O campo de nome não pode estar vazio.'
    },
    email: {
        valueMissing: 'O campo de email não pode estar vazio.',
        typeMismatch: 'O email digitado não é válido.'
    },
    senha: {
        valueMissing: 'O campo de senha não pode estar vazio.',
        patternMismatch: 'A senha deve conter entre 6 a 12 caracteres, deve conter pelo menos uma letra maiúscula, uma minúscula, um número e não deve conter símbolos.'
    },
    dataNascimento: {
        valueMissing: 'O campo de data de nascimento não pode estar vazio.',
        customError: 'Você deve ser maior que 18 anos para se cadastrar.'
    },
    cpf: {
        valueMissing: 'O campo de CPF não pode estar vazio.',
        customError: 'O CPF digitado não é válido.' 
    },
    cep: {
        valueMissing: 'O campo de CEP não pode estar vazio.',
        patternMismatch: 'O CEP digitado não é válido.',
        customError: 'Não foi possível buscar o CEP.'
    },
    logradouro: {
        valueMissing: 'O campo de logradouro não pode estar vazio.'
    },
    cidade: {
        valueMissing: 'O campo de cidade não pode estar vazio.'
    },
    estado: {
        valueMissing: 'O campo de estado não pode estar vazio.'
    },
    telefone: {
        valueMissing: 'O campo de Telefone não pode estar vazio.',
        patternMismatch: 'O Telefone digitado não é válido.',
    },
    instagram:{
        valueMissing: 'O campo Instagram não pode estar vazio.',
        patternMismatch: 'O Usúario digitado não é válido.',
        customError: 'O Usúario digitado não é válido.'
        
    },
    nomeProduto : {
        valueMissing: 'O campo do nome do produto não pode estar vazio.',
        customError: 'O Campo nome do produto não pode estar vazio.'
    },
    quantidade:{
        valueMissing: 'O campo de Quantidade de produto não pode estar vazio.',
        customError: 'O Campo Quantidade em estoque não pode estar vazio.'
    }


}

const validadores = {
    dataNascimento:input => validaDataNascimento(input),
    cpf:input => validaCPF(input),
    cep:input => recuperarCEP(input),
    telefone: input => validaTelefone(input),
    instagram: input => addArrobaInstagram(input),
    nomeProduto: input => verificaNomeProduto(input),
    quantidade: input=> verificarQuantidade(input)
}
function verificaNomeProduto(input) {
    let mensagem = ''
    if (input.value.length < 5) { mensagem = 'msgError'; }
    input.setCustomValidity(mensagem)
}

function verificarQuantidade(input) {
    let mensagem = ''
    if (input.value.length < 10) { mensagem = 'msgError' }
    input.setCustomValidity(mensagem)
}
function validarCampo(campo) {
    const valor = campo.value.trim();
    const numeros = /^[0-9]+$/;
    if (valor === '') {
      campo.setCustomValidity('Este campo não pode ser vazio');
    } else if (!valor.match(numeros)) {
      campo.setCustomValidity('Este campo deve conter apenas números');
    } else {
      campo.setCustomValidity('');
    }
  }
//   const quantidadeInput = document.querySelector('#quantidade');
// quantidadeInput.addEventListener('input', function() {
//   validarCampo(this);
// });

  



function mostraMensagemDeErro(tipoDeInput, input) {
    let mensagem = ''
    tiposDeErro.forEach(erro => {
        if(input.validity[erro]) {
            mensagem = mensagensDeErro[tipoDeInput][erro]
        }
    })
    
    return mensagem
}



//IMPLEMENTAÇÃO DE CÓDIGO:
function addArrobaInstagram(input) {
    if (input.value !== '' && input.value.charAt(0) !== '@') {
        input.value = `@${input.value}`
    }
}

function validaTelefone(input) {
    let ddd = input.value.replace(/[^0-9]/g, '').substr(0, 2);
    const url = './assets/docs/ddd_estados.json'

    if (!input.validity.valueMissing && !input.validity.patternMismatch) {
        fetch(url).then(
                response => response.json()
            )
            .then(data => {
                if (data[ddd] === undefined) {
                    input.setCustomValidity('DDD inválido')
                    return
                }
                input.setCustomValidity('')
                return
            })
    }
}





function validaDataNascimento(input) {
    const dataRecebida = new Date(input.value)
    let mensagem = ''

    if(!maiorQue18(dataRecebida)) {
        mensagem = 'Você deve ser maior que 18 anos para se cadastrar.'
    }

    input.setCustomValidity(mensagem)
}

function maiorQue18(data) {
    const dataAtual = new Date()
    const dataMais18 = new Date(data.getUTCFullYear() + 18, data.getUTCMonth(), data.getUTCDate())

    return dataMais18 <= dataAtual
}

function validaCPF(input) {
    const cpfFormatado = input.value.replace(/\D/g, '')
    let mensagem = ''

    if(!checaCPFRepetido(cpfFormatado) || !checaEstruturaCPF(cpfFormatado)) {
        mensagem = 'O CPF digitado não é válido.'
    }

    input.setCustomValidity(mensagem)
}

function checaCPFRepetido(cpf) {
    const valoresRepetidos = [
        '00000000000',
        '11111111111',
        '22222222222',
        '33333333333',
        '44444444444',
        '55555555555',
        '66666666666',
        '77777777777',
        '88888888888',
        '99999999999'
    ]
    let cpfValido = true

    valoresRepetidos.forEach(valor => {
        if(valor == cpf) {
            cpfValido = false
        }
    })

    return cpfValido
}

function checaEstruturaCPF(cpf) {
    const multiplicador = 10

    return checaDigitoVerificador(cpf, multiplicador)
}

function checaDigitoVerificador(cpf, multiplicador) {
    if(multiplicador >= 12) {
        return true
    }

    let multiplicadorInicial = multiplicador
    let soma = 0
    const cpfSemDigitos = cpf.substr(0, multiplicador - 1).split('')
    const digitoVerificador = cpf.charAt(multiplicador - 1)
    for(let contador = 0; multiplicadorInicial > 1 ; multiplicadorInicial--) {
        soma = soma + cpfSemDigitos[contador] * multiplicadorInicial
        contador++
    }

    if(digitoVerificador == confirmaDigito(soma)) {
        return checaDigitoVerificador(cpf, multiplicador + 1)
    }

    return false
}

function confirmaDigito(soma) {
    return 11 - (soma % 11)
}

function recuperarCEP(input) {
    const cep = input.value.replace(/\D/g, '')
    const url = `https://viacep.com.br/ws/${cep}/json/`
    const options = {
        method: 'GET',
        mode: 'cors',
        headers: {
            'content-type': 'application/json;charset=utf-8'
        }
    }

    if(!input.validity.patternMismatch && !input.validity.valueMissing) {
        fetch(url,options).then(
            response => response.json()
        ).then(
            data => {
                if(data.erro) {
                    input.setCustomValidity('Não foi possível buscar o CEP.')
                    return
                }
                input.setCustomValidity('')
                preencheCamposComCEP(data)
                return
            }
        )
    }
}

function preencheCamposComCEP(data) {
    const logradouro = document.querySelector('[data-tipo="logradouro"]')
    const cidade = document.querySelector('[data-tipo="cidade"]')
    const estado = document.querySelector('[data-tipo="estado"]')

    logradouro.value = data.logradouro
    cidade.value = data.localidade
    estado.value = data.uf
}
