// ** 
// ** Fetches.js
// ** fetch를 통해 해당 URL와 통신하는 기능이 담긴 클래스
// **

class Fetches{
  constructor( id ){
    this.id = id;
    this.allData = [];
  }

  async getData(){
    try {
      // ** 총 데이터를 1만개씩 3파트로 나눠 그 배열을 가져오기 
      const urls = [ '1','2','3' ];
      const responses = await Promise.all( urls.map( url => fetch(
        `https://api.odcloud.kr/api/3039563/v1/uddi:d9dad564-5ef2-426e-bdbe-fd00aa8c7f23_201906120952?page=${url}&perPage=10000&serviceKey=Leyebd2MfA41YgrXmOdVU67BWZOnY6lTAlNCeK7kXHU4KcsScOd8%2FH%2B1NfFJYeLJXVeV2rDdwzx%2FzAh4GpuaMg%3D%3D`
      ) ) );
      
      for (const response of responses) {
        if ( !response.ok ) {
          throw new Error('네트워크 응답이 좋지 못합니다. ' + response.statusText);
        }
      }
  
      const dataSets = await Promise.all(responses.map(response => response.json()));
      
      // ** 모든 data 평탄화하여 배열에 넣기
      {
        let tempArr = [];
        this.allData = dataSets.map( data => data.data );
        this.allData.forEach( data =>{
          data.forEach( data2 =>{
            tempArr.push( data2 );
          })
        })
        this.allData = tempArr;
      }
    
      // ** 데이터를 가져온 후에 dataRemake 메소드 호출 및 데이터 전달
      this.dataRemake( this.allData );
    } catch (error) {
      console.error("fetch에 문제가 있어요", error);
    }

    // ** 실행한 결과값을 Promise반환
    return new Promise((resolve) => {
      resolve();
    });
  }

  async dataRemake() {
    if ( !this.allData || this.allData.length === 0 ) {
      console.error("아직 fetch 안됬음");
      return;
    }
  
    const cancerDataByAgeAndYear = {};
  
    this.allData.forEach(entry => {
      const {
        암종,
        발생연도,
        연령군,
        성,
        "발생자수(명)": 발생자수
      } = entry;
  
      if (연령군 !== "전체") {
        // ** 연령을 10단위로 묶기
        const ageGroup = `${Math.floor(parseInt(연령군) / 10) * 10}대`;
        
        // ** 객체 초기화
        if (!cancerDataByAgeAndYear[암종]) {
          cancerDataByAgeAndYear[암종] = {};
        }

        if (!cancerDataByAgeAndYear[암종][발생연도]) {
          cancerDataByAgeAndYear[암종][발생연도] = {};
        }

        if (!cancerDataByAgeAndYear[암종][발생연도][ageGroup]) {
          cancerDataByAgeAndYear[암종][발생연도][ageGroup] = {
            남자: 0,
            여자: 0
          };
        }
        
        if( 성 === "남녀전체" ){ return };
        let accrualsNumber = ( 발생자수 === "" ) ? ( 0 ) : ( parseInt( 발생자수 ) );
        cancerDataByAgeAndYear[암종][발생연도][ageGroup][성] += accrualsNumber;
      }
    });
    
    return cancerDataByAgeAndYear;
  }
}

const fetchData = new Fetches('fetches');
export { fetchData };