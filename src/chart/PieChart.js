import { Pie } from "vue-chartjs";
export default {
    extends: Pie,
    props: ["data", "options"],
    mounted() {
        this.renderChart(this.data, {
            borderWidth: "10px",
            hoverBackgroundColor: "red",
            hoverBorderWidth: "10px",
            legend: {
                labels: {
                    fontColor: '#ffffff'
                },
                display: false
            },
            elements: {
                arc: {
                    borderWidth: 0
                }
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        return data['labels'][tooltipItem['index']] + ': ' + data['datasets'][0]['data'][tooltipItem['index']] + '%';
                    }
                }
            }
        });
    }
};
