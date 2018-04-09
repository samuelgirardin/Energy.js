
// Created samuel girardin @samuelgirardin - 2018
// License Creative Commons Attribution-NonCommercial-ShareAlike 4.0 Unported License.
class DJointFixed extends Djoint {

    constructor(dxWorld: DxWorld, dxJointGRoup: DxJointGroup, uniqID: number, name: string = "") {
         // TODO  not really tested //
        super();
        this.dxWorld = dxWorld;
        this.dxJointGRoup = dxJointGRoup;
        this.name = name;
        this.uniqID = uniqID;

        this.dxJoint = Energy.dJointCreateFixed(this.dxWorld, this.dxJointGRoup);
        Djoint.Instances.push(this);  

    }
}