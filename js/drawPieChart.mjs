import { MakeChart } from './makeChart.mjs';
import { fetchData } from './Fetches.js';


export class DonutChart extends MakeChart {
    constructor(id) {
        super(id);
    }
    drawGraph(){
      async function fetchDataAndProcess() {
        try {
          await fetchData.getData(); // 데이터를 가져오는 비동기 함수 호출
          const cancerData = await fetchData.dataRemake(); // 데이터를 처리하는 비동기 함수 호출
          
          // console.log(cancerData);
          const viewGrpah = () =>{
            

            let ageList = [];
            let isAgeGroupsStored = false;

            // 각 연령대별 남자와 여자의 합을 저장할 배열
            let ageSums = [];

            for (let key in cancerData['모든암']) {
                if (!isAgeGroupsStored) {
                    let ageGroups = Object.keys(cancerData['모든암'][key]);
                    ageList.push(...ageGroups);
                    isAgeGroupsStored = true;
                }
            }
            // 각 연령대별 합계를 계산
            ageList.forEach(ageGroup => {
                let sum = 0;
                for (let key in cancerData['모든암']) {
                    sum += cancerData['모든암'][key][ageGroup]['남자'];
                    sum += cancerData['모든암'][key][ageGroup]['여자'];
                }
                ageSums.push(sum);
            });
            
            let sum0to30 = 0;
            for (let i = 0; i <= 3; i++) {
                sum0to30 += ageSums[i];
            }

            let combinedSums = [sum0to30];
            for (let i = 4; i < ageSums.length; i++) {
                combinedSums.push(ageSums[i]);
            }
            // console.log(combinedSums)
            let combinedAgeGroups = ['30대이하', '40대', '50대', '60대', '70대', '80대'];


              var ctxDoughnut = document.getElementById('sumaryCanvas_f').getContext('2d');
              var pieChart = new Chart(ctxDoughnut, {
                  type: 'doughnut',
                  data: {
                    labels: combinedAgeGroups,
                    datasets: [{
                      label: '환자수',
                      data: combinedSums,
                      backgroundColor: [
                        '#fde2e4',
                        '#fff1e6',
                        '#a1e6d3',
                        '#cddafd',
                        '#f1ddff',
                        '#ffddf6',
                      ],
                    }]
                  },
                  options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                      title: {
                        display: true,
                        text: '1999년 ~ 2016년 통계자료',
                        font:{
                          size:window.innerWidth>800 ? 20 : 16
                        }
                      }
                    }
                  }
                });
            }
          
        
          viewGrpah();
        } catch (error) {
          console.error('Error occurred:', error);
        }
      }
      fetchDataAndProcess();
    }
}



const mydChart = new DonutChart('PieChart');
mydChart.drawGraph()