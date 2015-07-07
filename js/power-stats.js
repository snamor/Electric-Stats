// Electric Stats v1.0.0
// Author: Pol Romans
// Licensed under MIT license (http://opensource.org/licenses/MIT)

var percentilePeakConsumption = 0.0;
var absolutePeakConsumption = 0.0;
var reportConversionFactor = 60 * 1000; //L'informe està en Wm i l'hem de convertir a kWh
var contractedPowerConversionFactor = 1000;


i18n.init(function() {
    $('body').i18n();
});

$(document).ready(function() {

    // The event listener for the file upload
    document.getElementById('txtFileUpload').addEventListener('change', upload, false);

    // Method that checks that the browser supports the HTML5 File API
    function browserSupportFileUpload() {
        var isCompatible = false;
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            isCompatible = true;
        }
        return isCompatible;
    }

    // Method that reads and processes the selected file
    function upload(evt) {
        if (!browserSupportFileUpload()) {
            alert( $.t("warning-outdated-browser") );
        } else {
            var data = null;
            var file = evt.target.files[0];
            var reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function(event) {
                var csvData = event.target.result;
                data = $.csv.toArrays(csvData);
                if (data && data.length > 0) {
                    data.sort(sortByConsumFunction);
                    displayData(data);
                } else {
                    alert( $.t('file-is-empty') );
                }
            };
            reader.onerror = function() {
                alert($.t('cannot-read-file') + ' ' + file.fileName);
            };
        }
    }

    function groupByHours(data){
        var i;
        var percentil99 = parseInt(99.9 * data.length / 100);
        var hourlyConsumption = [];

        for(i = 0; i <= 23; i++){
            hourlyConsumption[i] = 0;
        }

        percentilePeakConsumption = data[percentil99][1] / contractedPowerConversionFactor;
        absolutePeakConsumption = data[data.length - 2][1] / contractedPowerConversionFactor;

        for (i = 1; i < data.length; i++) {
            var date = data[i][0];

            date = date.split(/[- :]/);
            //date = new Date(date[0], date[1]-1, date[2], date[3], date[4], date[5]);
            var consum = parseFloat(data[i][1]) / reportConversionFactor;

            if(!isNaN(consum))
                hourlyConsumption[parseInt(date[3])] += consum;
        }
        return hourlyConsumption;
    }

    function displayData(data){
        var iniciPunta = $("#inici_punta").val();
        var finalPunta = $("#final_punta").val();

        var hourlyConsumption = groupByHours(data);

        //Renderitzar dades
        var consumption_table = $('#consumption_table');
        var information_table = $('#information_table');

        var totalConsum = 0.0;
        var totalPunta  = 0.0;
        var totalVall = 0.0;

        consumption_table.find('tbody').empty();


        var consum2D = [];
        for(var i = 0; i < hourlyConsumption.length; i++){
            var fila = "<tr><td>"+ i.toString()+"</td>" +
                "<td class=\"text-right\">"+hourlyConsumption[i].toFixed(2)+"</td></tr>";
            consumption_table.find('tbody').append(fila);
            totalConsum += hourlyConsumption[i];

            //Guardem si el consum és de punta o vall
            if(i >= iniciPunta && i < finalPunta){
                totalPunta += hourlyConsumption[i];
            }
            else{
                totalVall += hourlyConsumption[i];
            }

            consum2D.push([i,hourlyConsumption[i]])
        }
        consumption_table.find('.td_total').html(totalConsum.toFixed(2));
        information_table.find('.td_total').html(totalConsum.toFixed(2));
        information_table.find('.td_total_punta').html(totalPunta.toFixed(2));
        information_table.find('.td_total_vall').html(totalVall.toFixed(2));
        //information_table.find('.td_potencia_recomanada').html(getPotenciaRecomanada());
        information_table.find('.td_potencia_percentil').html(percentilePeakConsumption);
        information_table.find('.td_potencia_maxima').html(absolutePeakConsumption);

        //Pintar gràfiques
        drawGraphics();
        $('.block_mostra_dades').show();
        $(window).trigger('resize');
    }

    function drawGraphics(){
        $('#chart_placeholder').highcharts({
            data: {
                table: document.getElementById('consumption_table'),
                startRow: 1
            },
            chart: {
                type: 'column'
            },
            title: {
                text: $.t('comulated-consumption')
            },
            yAxis: {
                allowDecimals: false,
                title: {
                    text: 'kWh'
                }
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' +
                        this.point.y + ' ' + this.point.name.toLowerCase();
                }
            }
        });
    }

    function sortByConsumFunction(a, b) {
        var operandA = parseFloat(a[1]);
        var operandB = parseFloat(b[1]);

        if (operandA === operandB) {
            return 0;
        }
        else {
            return (operandA < operandB) ? -1 : 1;
        }
    }
});