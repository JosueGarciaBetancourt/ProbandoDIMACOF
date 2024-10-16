let tecnicoCanjesInput = document.getElementById('tecnicoCanjesInput');
let idTecnicoOptions = 'tecnicoCanjesOptions';
let tecnicoCanjesTooltip = document.getElementById('idTecnicoCanjesTooltip');
let messageErrorTecnicoCanjesInput = document.getElementById('messageErrorTecnicoCanjes')
let recompensaCanjesTooltip = document.getElementById('idRecompensaCanjesTooltip');
let numComprobanteCanjesTooltip = document.getElementById('idNumComprobanteCanjesTooltip');
let resumenContainer = document.getElementById('idResumenContainer');
let numComprobanteCanjesInput = document.getElementById('comprobanteCanjesInput');
let puntosActualesCanjesInput = document.getElementById('puntosActualesCanjesInput');
let comprobantesFetch = [];
let puntosGeneradosCanjesInput = document.getElementById('puntosGeneradosCanjesInput');
let puntosRestantesCanjesInput = document.getElementById('puntosRestantesCanjesInput');
let clienteCanjesTextarea = document.getElementById('clienteCanjesTextarea');
let fechaEmisionCanjesInput = document.getElementById('fechaEmisionCanjesInput');
let fechaCargadaCanjesInput = document.getElementById('fechaCargadaCanjesInput');
let cantidadRecompensaCanjesInput = document.getElementById('cantidadRecompensaCanjesInput');

function getFormattedDate() {
    let today = new Date();
    let day = String(today.getDate()).padStart(2, '0'); // Obtener el día y añadir un 0 si es necesario
    let month = String(today.getMonth() + 1).padStart(2, '0'); // Obtener el mes y añadir un 0 si es necesario
    let year = today.getFullYear(); // Obtener el año

    return `${year}-${month}-${day}`; // Formato YYYY-MM-DD (requerido para inputs tipo date)
}

let date = getFormattedDate();
let tecnicoFilledCorrectlySearchField = false;
let recompensaFilledCorrectlySearchField = false;

document.addEventListener("DOMContentLoaded", function() {
    let fechaCanjeInput = document.getElementById('idFechaCanjeInput');
    fechaCanjeInput.value = date;  // Asigna la fecha en formato YYYY-MM-DD
});

function consoleLogJSONItems(items) {
    console.log(JSON.stringify(items, null, 2));
}

function selectOptionNumComprobanteCanjes(value, idInput, idOptions) {
    if (tecnicoCanjesInput.value && tecnicoFilledCorrectlySearchField) {
        resumenContainer.classList.add('shown');
        selectOption(value, idInput, idOptions); 

        // Verificamos si `comprobantesFetch` contiene datos
        if (comprobantesFetch && comprobantesFetch.length > 0) {
            // Buscamos el comprobante que tenga el ID que coincide con `value`
            const comprobanteSeleccionado = comprobantesFetch.find(comprobante => comprobante.idVentaIntermediada === value);

            if (comprobanteSeleccionado) {
                // Asignamos los valores del comprobante seleccionado a los inputs
                puntosGeneradosCanjesInput.value = comprobanteSeleccionado.puntosGanados_VentaIntermediada || '';
                puntosRestantesCanjesInput.value = comprobanteSeleccionado.montoTotal_VentaIntermediada || '';
                clienteCanjesTextarea.value = 
                    (comprobanteSeleccionado.nombreCliente_VentaIntermediada +  "\n" + 
                    comprobanteSeleccionado.tipoCodigoCliente_VentaIntermediada +  ": " + 
                    comprobanteSeleccionado.codigoCliente_VentaIntermediada) || '';
                fechaEmisionCanjesInput.value = comprobanteSeleccionado.fechaHoraEmision_VentaIntermediada ? comprobanteSeleccionado.fechaHoraEmision_VentaIntermediada.split(' ')[0] : ''; // Solo la fecha
                fechaCargadaCanjesInput.value = comprobanteSeleccionado.fechaHoraCargada_VentaIntermediada ? comprobanteSeleccionado.fechaHoraCargada_VentaIntermediada.split(' ')[0] : ''; // Solo la fecha
                
                fechaEmisionCanjesInput.classList.remove("noEditable");
                fechaCargadaCanjesInput.classList.remove("noEditable");

                //console.log("Comprobante seleccionado:", comprobanteSeleccionado);
            } else {
                console.error("No se encontró el comprobante con el ID:", value);
            }
        } else {
            console.error("No se encontraron comprobantes.");
        }
        return;
    }

    fechaEmisionCanjesInput.classList.add("noEditable");
    fechaCargadaCanjesInput.classList.add("noEditable");
    resumenContainer.classList.remove('shown');
}

function toggleNumComprobanteCanjesOptions(idInput, idOptions) {
    // Verificamos que el campo del técnico tenga un valor y separemos el DNI y el nombre
    const tecnicoValue = tecnicoCanjesInput.value;

    // Verificamos que se haya encontrado un técnico y que coincida con las opciones disponibles
    const allItems = getAllLiText(idTecnicoOptions); 
    const itemEncontrado = allItems.includes(tecnicoValue);

    /*console.log(allItems);
    console.log(tecnicoValue);
    console.log(itemEncontrado);*/

    if (itemEncontrado) {
        toggleOptions(idInput, idOptions); // Mostrar u ocultar las opciones
    } else {
        showHideTooltip(tecnicoCanjesTooltip, "Seleccione un Técnico primero");
    }
}


function validateOptionTecnicoCanjes(input, idOptions, idMessageError, tecnicosDB) {
    const value = input.value;
    const messageError = document.getElementById(idMessageError);

    // Obtener todos los valores del item (la función está en dashboardScrip.js)
    const allItems = getAllLiText(idOptions);

    // Comparar el valor ingresado con la lista de items 
    const itemEncontrado = allItems.includes(value);
    const [idTecnico, nombreTecnico] = value.split(' - ');

    if (value) {
        if (!itemEncontrado)  {
            messageError.textContent = "No se encontró el técnico buscado";
            messageError.classList.add('shown'); 
            puntosActualesCanjesInput.value = "";   
            numComprobanteCanjesInput.value = "";
            tecnicoFilledCorrectlySearchField = false;
        } else {
            filterNumComprobantesInputWithTecnicoFetch(idTecnico);
            const puntosTecnicoIngresado = returnPuntosActualesDBWithRequestedTecnicoID(idTecnico, tecnicosDB);
            puntosActualesCanjesInput.value = puntosTecnicoIngresado;
            tecnicoFilledCorrectlySearchField = true;
        }
    } else {
        messageError.classList.remove('shown'); 
    }
}

function selectOptionTecnicoCanjes(value, idInput, idOptions, puntosActuales, idTecnico) {
    selectOption(value, idInput, idOptions);
    puntosActualesCanjesInput.value = puntosActuales;
    tecnicoFilledCorrectlySearchField = true;
    filterNumComprobantesInputWithTecnicoFetch(idTecnico);
}

function selectOptionRecompensaCanjes(value, idInput, idOptions) {
    if(!numComprobanteCanjesInput.value) {
        showHideTooltip(numComprobanteCanjesTooltip, "Seleccione un Número de comprobante primero");
        return;
    }

    selectOption(value, idInput, idOptions);
    recompensaCanjesTooltip.classList.remove('red');
    recompensaCanjesTooltip.classList.add('green');
    showHideTooltip(recompensaCanjesTooltip, "Recompensa encontrada");
}

function validateOptionRecompensaCanjes(input, idOptions, idMessageError, recompensasDB) {
    const value = input.value;
    //const messageError = document.getElementById(idMessageError);

    // Obtener todos los valores del item (la función está en dashboardScrip.js)
    const allItems = getAllLiText(idOptions);

    // Comparar el valor ingresado con la lista de items 
    const itemEncontrado = allItems.includes(value);
   
    // Valor no encontrado o 
    if (value && !itemEncontrado)  {
        //messageError.classList.add('shown'); 
        recompensaFilledCorrectlySearchField = false;
        recompensaCanjesTooltip.classList.remove('green');
        recompensaCanjesTooltip.classList.add('red');
        showHideTooltip(recompensaCanjesTooltip, "No se encontró la recompensa buscada");
    } else if (value && itemEncontrado) {
        //messageError.classList.remove('shown');
        recompensaFilledCorrectlySearchField = true;
        recompensaCanjesTooltip.classList.remove('red');
        recompensaCanjesTooltip.classList.add('green');
        showHideTooltip(recompensaCanjesTooltip, "Recompensa encontrada");
    }
}

function validateNumComprobanteInputNoEmpty(recompensaCanjesInput) {
    if(!numComprobanteCanjesInput.value) {
        recompensaCanjesInput.value = '';
        showHideTooltip(numComprobanteCanjesTooltip, "Seleccione tipo de documento primero");
    } 
}

function hideResumeContainer() {
    console.log("Limpiando input Número de comprobante");
    resumenContainer.classList.remove('shown');
    puntosGeneradosCanjesInput.value = "";
    puntosRestantesCanjesInput.value = "";
    clienteCanjesTextarea.value = "";
    fechaEmisionCanjesInput.value = "";
    fechaCargadaCanjesInput.value = "";
}

function returnPuntosActualesDBWithRequestedTecnicoID(idTecnico, tecnicosDB) {
    for (const key in tecnicosDB) {
        if (tecnicosDB[key]["idTecnico"] === idTecnico) {
            return tecnicosDB[key]["totalPuntosActuales_Tecnico"];
        }
    }
    return null; 
}

async function filterNumComprobantesInputWithTecnicoFetch(idTecnico) {
    const url = `http://localhost/FidelizacionTecnicos/public/dashboard-canjes/tecnico/${idTecnico}`;

    try {
        const response = await fetch(url);
        /*console.log("Fetching URL:", url);
        console.log('Response Status:', response.status);
        console.log('Response Headers:', response.headers.get('Content-Type'));*/

        if (!response.ok) {
            throw new Error(await response.text());
        }

        comprobantesFetch = await response.json();
    
        if (comprobantesFetch.length == 0) {
            messageErrorTecnicoCanjesInput.textContent = 'El técnico encontrado no tiene ventas intermediadas "EN ESPERA"'
            messageErrorTecnicoCanjesInput.classList.add('shown');
        } else {
            messageErrorTecnicoCanjesInput.classList.remove('shown');
        }

        const comprobanteOptions = document.getElementById('comprobanteOptions');
        comprobanteOptions.innerHTML = '';

        comprobantesFetch.forEach(comprobante => {
            const li = document.createElement('li');
            li.textContent = `${comprobante.idVentaIntermediada}`;
            li.onclick = function() {
                selectOptionNumComprobanteCanjes(`${comprobante.idVentaIntermediada}`, 'comprobanteCanjesInput', 'comprobanteOptions');
            };
            comprobanteOptions.appendChild(li);
        });
    } catch (error) {
        console.error('Error al obtener los comprobantes:', error.message);
        // Aquí puedes añadir código para mostrar el error al usuario
    }
}
    
let incrementInterval; // Para el incremento
let decrementInterval; // Para el decremento

function countUpCantidadRecompensa() {
    if (cantidadRecompensaCanjesInput.value == null || cantidadRecompensaCanjesInput.value == "" ) {
        cantidadRecompensaCanjesInput.value = "0";
    } else if (cantidadRecompensaCanjesInput.value < 100) {
        cantidadRecompensaCanjesInput.vaglue = parseInt(cantidadRecompensaCanjesInput.value) + 1;
    }

    // Esto asegura que se dispare el observer
    cantidadRecompensaCanjesInput.setAttribute('value', (parseInt(cantidadRecompensaCanjesInput.value) || 0) + 1); 
}

function countDownCantidadRecompensa() {
    if (cantidadRecompensaCanjesInput.value != null && cantidadRecompensaCanjesInput.value != "" && cantidadRecompensaCanjesInput.value > 0) {
        // Convertir texto a entero y disminuir en 1 el valor de la actual cantidad
        cantidadRecompensaCanjesInput.value = parseInt(cantidadRecompensaCanjesInput.value) - 1;
        cantidadRecompensaCanjesInput.setAttribute('value', parseInt(cantidadRecompensaCanjesInput.value) - 1); 
    }  
}

// Manejo del evento de mouse para incrementar
document.getElementById('incrementButton').addEventListener('mousedown', function() {
    countUpCantidadRecompensa(); // Llamar una vez para iniciar
    incrementInterval = setInterval(countUpCantidadRecompensa, 250); // Ajusta el intervalo según sea necesario
});

// Manejo del evento de mouse para decrementar
document.getElementById('decrementButton').addEventListener('mousedown', function() {
    countDownCantidadRecompensa(); // Llamar una vez para iniciar
    decrementInterval = setInterval(countDownCantidadRecompensa, 250); // Ajusta el intervalo según sea necesario
});

// Detener el incremento o decremento al soltar el botón
document.addEventListener('mouseup', function() {
    clearInterval(incrementInterval);
    clearInterval(decrementInterval);
});

// Detener el intervalo si el ratón sale del botón
/*document.getElementById('incrementButton').addEventListener('mouseleave', function() {
    clearInterval(incrementInterval);
});

document.getElementById('decrementButton').addEventListener('mouseleave', function() {
    clearInterval(decrementInterval);
});*/

document.addEventListener('DOMContentLoaded', function() {
    // Recuperar valores guardados y establecerlos en los inputs
    document.querySelectorAll('.persist-input').forEach(function(input) {
        //console.log(input.id);
        var savedValue = localStorage.getItem(input.id);
        if (savedValue !== null) {
            input.value = savedValue;
            //console.log(input.id + ": " + input.value);
        }

        // Configurar el observador para que observe cambios en los atributos
        const observer = new MutationObserver(handleInputChange);

        // Opciones de configuración del observador
        const config = { attributes: true, attributeFilter: ['value'] };

        // Iniciar la observación del input
        observer.observe(input, config);

        // Añadir event listener para guardar el valor cuando cambie
        input.addEventListener('input', function() {
            // Guardar el valor actual en localStorage
            console.log("Guardando en local storage: ", input.id, " con valor: ", input.value)
            localStorage.setItem(input.id, input.value);
        });
    });
});

// Función para limpiar todos los valores guardados
function clearAllPersistedInputs() {
    document.querySelectorAll('.persist-input').forEach(function(input) {
        localStorage.removeItem(input.id);
        input.value = '';
    });
}

// Función para limpiar un input específico
function clearPersistedInput(inputId) {
    localStorage.removeItem(inputId);
    var input = document.getElementById(inputId);   
    if (input) {
        input.value = '';
    }
}

// Función que se ejecutará cuando el valor del input cambie
function handleInputChange(mutationsList, observer) {
    mutationsList.forEach(function(mutation) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
            console.log('El valor del input ha sido observado:', mutation.target.id, mutation.target.value);
            // Aquí puedes manejar el cambio del valor
            localStorage.setItem(mutation.target.id, mutation.target.value);
        }
    });
}