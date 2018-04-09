
// Created samuel girardin @samuelgirardin - 2018
// License Creative Commons Attribution-NonCommercial-ShareAlike 4.0 Unported License.
class DJointTransmission extends Djoint {


    constructor(dxWorld: DxWorld, dxJointGRoup: DxJointGroup, uniqID : number,  name: string = "") {  

        super(); 

        this.dxWorld = dxWorld;
        this.dxJointGRoup = dxJointGRoup;
        this.name = name;
        this.uniqID = uniqID; 

        this.dxJoint = Energy.dJointCreateTransmission(this.dxWorld, this.dxJointGRoup);
        Djoint.Instances.push(this);  

    }


    /**
 * @brief set the Transmission joint mode
 * @remarks The mode can be one of dTransmissionParallelAxes,
 * dTransmissionIntersectingAxes and dTransmissionChainDrive simulating a
 * set of parallel-axes gears, intersecting-axes beveled gears or
 * chain and sprockets respectively.
 * @ingroup joints
 */
    public dJointSetTransmissionMode(mode: number): void {  
        Energy.dJointSetTransmissionMode(this.dxJoint, mode);       

    }



    /**
 * @brief set the Transmission ratio
 * @remarks This is the ratio of the angular speed of the first gear
 * to that of the second gear.  It can only be set explicitly in
 * parallel-axes mode.  In intersecting-axes mode the ratio is defined
 * implicitly by the initial configuration of the wheels and in chain
 * mode it is defined implicitly be the wheel radii.
 * @ingroup joints
 */
    public dJointSetTransmissionRatio(ratio: number): void { 
        Energy.dJointSetTransmissionRatio(this.dxJoint, ratio);        
    }



    /**
 * @brief set the first anchor for the Transmission joint
 * @remarks This is the point of attachment of the wheel on the
 * first body.  It is given in global coordinates.
 * @ingroup joints
 */
    public dJointSetTransmissionAnchor1(x: number, y: number, z: number): void {
        Energy.dJointSetTransmissionAnchor1(this.dxJoint, x, y, z);        
    }



     /**
 * @brief set the second anchor for the Transmission joint
 * @remarks This is the point of attachment of the wheel on the
 * second body.  It is given in global coordinates.
 * @ingroup joints
 */  
    public dJointSetTransmissionAnchor2(x: number, y: number, z: number): void { 
        Energy.dJointSetTransmissionAnchor2(this.dxJoint, x, y, z);       
    }



/**
 * @brief set the common axis for both wheels of the Transmission joint
 * @remarks This sets the common axis of revolution for both wheels
 * and should only be used in parallel-axes or chain mode.  For
 * intersecting-axes mode where each wheel axis needs to be specified
 * individually dJointSetTransmissionAxis1 and
 * dJointSetTransmissionAxis2 should be used.  The axis is given in
 * global coordinates
 * @ingroup joints
 */
    public dJointSetTransmissionAxis(x: number, y: number, z: number): void { 
        Energy.dJointSetTransmissionAxis(this.dxJoint, x, y, z);
    }


 /**
 * @brief set the backlash of the Transmission joint
 * @remarks Backlash is the clearance in the mesh of the wheels of the
 * transmission and is defined as the maximum distance that the
 * geometric contact point can travel without any actual contact or
 * transfer of power between the wheels.  This can be converted in
 * degrees of revolution for each wheel by dividing by the wheel's
 * radius.  To further illustrate this consider the situation where a
 * wheel of radius r_1 is driving another wheel of radius r_2 and
 * there is an amount of backlash equal to b in their mesh.  If the
 * driving wheel were to instantaneously stop there would be no
 * contact and hence the driven wheel would continue to turn for
 * another b / r_2 radians until all the backlash in the mesh was take
 * up and contact restored with the relationship of driving and driven
 * wheel reversed.  The backlash is therefore given in untis of
 * length.
  * @ingroup joints
 */

    public dJointSetTransmissionBacklash(backlash: number) { 
        Energy.dJointSetTransmissionBacklash(this.dxJoint, backlash);      

    }

// TODO
/*
int dJointGetTransmissionMode( dJointID j );
void dJointGetTransmissionContactPoint1(dJointID, dVector3 result);
void dJointGetTransmissionContactPoint2(dJointID, dVector3 result);

void dJointSetTransmissionAxis1(dJointID, dReal x, dReal y, dReal z);
void dJointSetTransmissionAxis2(dJointID, dReal x, dReal y, dReal z);
void dJointGetTransmissionAxis1(dJointID, dVector3 result);
void dJointGetTransmissionAxis2(dJointID, dVector3 result);
void dJointGetTransmissionAnchor1(dJointID, dVector3 result);
void dJointGetTransmissionAnchor2(dJointID, dVector3 result);

+ alot..

*/
    

}