
// Created samuel girardin @samuelgirardin - 2018
// License Creative Commons Attribution-NonCommercial-ShareAlike 4.0 Unported License.
class DJointBall extends Djoint {

    private anchor: Vector3_Ptr;
    private anchor2: Vector3_Ptr;

    constructor(dxWorld: DxWorld, dxJointGRoup: DxJointGroup, uniqID: number, name: string = "") {

        super();
        this.dxWorld = dxWorld;
        this.dxJointGRoup = dxJointGRoup;
        this.name = name;
        this.uniqID = uniqID;

        this.dxJoint = Energy.dJointCreateBall(this.dxWorld, this.dxJointGRoup);
        Djoint.Instances.push(this);

    }

    /**
    * brief Set the joint anchor point.
    * ingroup joints
    *
    * The joint will try to keep this point on each body
    * together. The input is specified in world coordinates. */

    public dJointSetBallAnchor(x: number, y: number, z: number) {
        Energy.dJointSetBallAnchor(this.dxJoint, x, y, z);
    }

    /**
 * @brief Set the joint anchor point.
 * @ingroup joints
 */

    public dJointSetBallAnchor2(x: number, y: number, z: number) {
        Energy.dJointSetBallAnchor2(this.dxJoint, x, y, z);
    } 

    /**
 * @brief Get the joint anchor point, in world coordinates.
 *
 * This returns the point on body 1. If the joint is perfectly satisfied,
 * this will be the same as the point on body 2.
 */
    public dJointGetBallAnchor(): Array<number> {

        if (this.anchor == undefined) {
            this.anchor = EnergyTools.Malloc_new_Vector3();
        }
        Energy.dJointGetBallAnchor(this.dxJoint, this.anchor);
        return EnergyTools.Pointer_To_Vector3(this.anchor, true);
    }

    
    /**
     * @brief Get the joint anchor point, in world coordinates.
     *
     * This returns the point on body 2. You can think of a ball and socket
     * joint as trying to keep the result of dJointGetBallAnchor() and
     * dJointGetBallAnchor2() the same.  If the joint is perfectly satisfied,
     * this function will return the same value as dJointGetBallAnchor() to
     * within roundoff errors. dJointGetBallAnchor2() can be used, along with
     * dJointGetBallAnchor(), to see how far the joint has come apart.
     */

    public dJointGetBallAnchor2(): Array<number> {

        if (this.anchor2 == undefined) {
            this.anchor2 = EnergyTools.Malloc_new_Vector3();
        }
        Energy.dJointGetBallAnchor2(this.dxJoint, this.anchor2);
        return EnergyTools.Pointer_To_Vector3(this.anchor, true);
    }   
}