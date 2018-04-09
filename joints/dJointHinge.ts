
// Created samuel girardin @samuelgirardin - 2018
// License Creative Commons Attribution-NonCommercial-ShareAlike 4.0 Unported License.
class DJointHinge extends Djoint {

    private anchor: Vector3_Ptr;
    private anchor2: Vector3_Ptr;
    private axis: Vector3_Ptr; 

    constructor(dxWorld: DxWorld, dxJointGRoup: DxJointGroup,uniqID:number, name: string = "") {
        super();

        this.dxWorld = dxWorld;
        this.dxJointGRoup = dxJointGRoup;
        this.uniqID = uniqID;
        this.name = name;  
        this.dxJoint = Energy.dJointCreateHinge(this.dxWorld, this.dxJointGRoup); 
        Djoint.Instances.push(this);  
    }

/**
* brief Set hinge anchor parameter.
* ingroup joints
*/
    public dJointSetHingeAnchor(x: number, y: number, z: number): void {
        Energy.dJointSetHingeAnchor(this.dxJoint, x, y, z);       
    }


/**
* brief Set hinge axis.
* ingroup joints
*/
    public dJointSetHingeAxis( x: number, y: number, z: number): void { 
        Energy.dJointSetHingeAxis(this.dxJoint, x, y, z);        
    }

    /**
 * @brief Get the hinge anchor point, in world coordinates.
 *
 * This returns the point on body 1. If the joint is perfectly satisfied,
 * this will be the same as the point on body 2.
 * @ingroup joints
 */


    public dJointGetHingeAnchor(): Array<number> {

        if (this.anchor == undefined) {
            this.anchor = EnergyTools.Malloc_new_Vector3();
        }
        Energy.dJointGetHingeAnchor(this.dxJoint, this.anchor);
        return EnergyTools.Pointer_To_Vector3(this.anchor,true);
    }
    /**
 * @brief Get the joint anchor point, in world coordinates.
 * This returns the point on body 2. If the joint is perfectly satisfied,
 * this will return the same value as dJointGetHinge2Anchor.
 * If not, this value will be slightly different.
 * This can be used, for example, to see how far the joint has come apart.
 * @ingroup joints
 */

    public dJointGetHingeAnchor2(): Array<number>  {
        if (this.anchor2 == undefined) {
            this.anchor2 = EnergyTools.Malloc_new_Vector3();
        }
        Energy.dJointGetHingeAnchor2(this.dxJoint, this.anchor2);
        return EnergyTools.Pointer_To_Vector3(this.anchor2,true);
    }
    /**
 * @brief Get joint axis
 * @ingroup joints
 */
    public dJointGetHingeAxis(): Array<number> {
        if (this.axis == undefined) {
            this.axis = EnergyTools.Malloc_new_Vector3();
        }
        Energy.dJointGetHingeAxis(this.dxJoint, this.axis);
        return EnergyTools.Pointer_To_Vector3(this.axis,true);
    }

    /**
 * @brief Get the hinge angle.
 *
 * The angle is measured between the two bodies, or between the body and
 * the static environment.
 * The angle will be between -pi..pi.
 * Give the relative rotation with respect to the Hinge axis of Body 1 with
 * respect to Body 2.
 * When the hinge anchor or axis is set, the current position of the attached
 * bodies is examined and that position will be the zero angle.
 * @ingroup joints
 */

    public dJointGetHingeAngle(): number {
        console.log("test"); 
        return Energy.dJointGetHingeAngle(this.dxJoint);  
    }

    /**
 * @brief Get the hinge angle time derivative.
 * @ingroup joints
 */

    public dJointGetHingeAngleRate(): number {

        return Energy.dJointGetHingeAngleRate(this.dxJoint); 

    }

  
    

}