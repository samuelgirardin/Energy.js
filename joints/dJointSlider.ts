class DJointSlider extends Djoint {


    constructor(dxWorld: DxWorld, dxJointGRoup: DxJointGroup, uniqID : number , name: string = "") {

        super();
        this.dxWorld = dxWorld;
        this.dxJointGRoup = dxJointGRoup;
        this.name = name;
        this.uniqID = uniqID;  
        this.dxJoint = Energy.dJointCreateSlider(this.dxWorld, this.dxJointGRoup);

        Djoint.Instances.push(this);
     
    }

    /**
* brief Set slider axis.
* ingroup joints
*/
    public dJointSetSliderAxis(x: number, y: number, z: number): void { 
       
        Energy.dJointSetSliderAxis(this.dxJoint, x, y, z);           
    }
    
        // TODO
        /*void dJointGetSliderAxis(dJointID, dVector3 result);
        dReal dJointGetSliderPosition (dJointID);
        dReal dJointGetSliderPositionRate (dJointID);*/
}