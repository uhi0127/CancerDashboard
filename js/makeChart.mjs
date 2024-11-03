export class MakeChart{
    constructor(id){
        this.id = id;
    }
    drawChart(type){
        switch(type){
            case 'pie':
                console.log('pp');
                break;
            case 'line':
                console.log('ll');
                break;
            case 'bar':
                console.log('bb');
                break;

        } 
    }
}