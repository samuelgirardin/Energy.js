class DJointHinge2 extends Djoint {


    private anchor: Vector3_Ptr;
    private anchor2: Vector3_Ptr;
    private axis1: Vector3_Ptr;
    private axis2: Vector3_Ptr;


    constructor(dxWorld: DxWorld, dxJointGRoup: DxJointGroup, uniqID: number, name: string = "") {
        super();

        this.dxWorld = dxWorld;
        this.dxJointGRoup = dxJointGRoup;
        this.uniqID = uniqID;
        this.name = name;

        this.dxJoint = Energy.dJointCreateHinge2(this.dxWorld, this.dxJointGRoup);

        Djoint.Instances.push(this);



    }

    /**
    * brief Set hinge anchor parameter.
    * ingroup joints
    */
    public dJointSetHinge2Anchor(x: number, y: number, z: number): void {

        Energy.dJointSetHinge2Anchor(this.dxJoint, x, y, z);
    } 
    /**
    * brief Set hinge axis1
    * ingroup joints
    */
    public dJointSetHinge2Axis1(x: number, y: number, z: number): void {
        Energy.dJointSetHinge2Axis1(this.dxJoint, x, y, z);
    }
    /**
   * brief Set hinge axis2
   * ingroup joints
   */
    public dJointSetHinge2Axis2(x: number, y: number, z: number): void {
        Energy.dJointSetHinge2Axis2(this.dxJoint, x, y, z);
    }
    /**
  * brief Get hinge axis1
  * ingroup joints
  */
    public dJointGetHinge2Angle1(): number {
        return Energy.dJointGetHinge2Angle1(this.dxJoint);
    }

    /**
  * @brief Get the joint anchor point, in world coordinates.
  * @return the point on body 1.  If the joint is perfectly satisfied,
  * this will be the same as the point on body 2.
  * @ingroup joints
  */
    public dJointGetHinge2Anchor(): Array<number> {

        if (this.anchor == undefined) {
            this.anchor = EnergyTools.Malloc_new_Vector3();
        }
        Energy.dJointGetHinge2Anchor(this.dxJoint, this.anchor);
        return EnergyTools.Pointer_To_Vector3(this.anchor, true);
    }
    /**
 * @brief Get the joint anchor point, in world coordinates.
 * This returns the point on body 2. If the joint is perfectly satisfied,
 * this will return the same value as dJointGetHinge2Anchor.
 * If not, this value will be slightly different.
 * This can be used, for example, to see how far the joint has come apart.
 * @ingroup joints
 */

    public dJointGetHinge2Anchor2() {
        if (this.anchor2 == undefined) {
            this.anchor2 = EnergyTools.Malloc_new_Vector3();
        }
        Energy.dJointGetHinge2Anchor2(this.dxJoint, this.anchor2);
        return EnergyTools.Pointer_To_Vector3(this.anchor2, true);
    }
    /**
 * @brief Get joint axis
 * @ingroup joints
 */
    public dJointGetHinge2Axis1() {
        if (this.axis1 == undefined) {
            this.axis1 = EnergyTools.Malloc_new_Vector3();
        }
        Energy.dJointGetHinge2Axis1(this.dxJoint, this.axis1);
        return EnergyTools.Pointer_To_Vector3(this.axis1, true);
    }
    /**
 * @brief Get joint axis
 * @ingroup joints
 */

    public dJointGetHinge2Axis2() {
        if (this.axis2 == undefined) {
            this.axis2 = EnergyTools.Malloc_new_Vector3();
        }
        Energy.dJointGetHinge2Axis2(this.dxJoint, this.axis2);
        return EnergyTools.Pointer_To_Vector3(this.axis2, true);
    }


     //TODO 
    /*
   
    dReal dJointGetHinge2Angle1Rate (dJointID);
    dReal dJointGetHinge2Angle2Rate (dJointID);
    */





}