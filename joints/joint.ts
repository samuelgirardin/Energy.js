class Djoint {

    public dxJoint: DxJoint;
    public dxWorld: DxWorld;
    public dxJointGRoup: DxJointGroup; 
    public uniqID: number; 
    public name: string;

    public static Instances: Array<Djoint> = new Array<Djoint>(); 


    constructor() { }

/**
 * @brief Attach the joint to some new bodies.
 * @ingroup joints
 *
 * If the joint is already attached, it will be detached from the old bodies
 * first.
 * To attach this joint to only one body, set body1 or body2 to zero - a zero
 * body refers to the static environment.
 * Setting both bodies to zero puts the joint into "limbo", i.e. it will
 * have no effect on the simulation.
 * @remarks
 * Some joints, like hinge-2 need to be attached to two bodies to work.
 */
    public dJointAttach(b1: DxBody, b2: DxBody): void {
        Energy.dJointAttach(this.dxJoint, b1, b2); 
      
    }


    /**
 * @brief Sets the datastructure that is to receive the feedback.
 *
 * The feedback can be used by the user, so that it is known how
 * much force an individual joint exerts.
 * @ingroup joints
 */

    public dJointSetFeedback(dxJoint: DxJoint, dJointFeedback: DJointFeedback): void {  
        Energy.dJointSetFeedback(dxJoint, dJointFeedback);
    }

       /**
    * brief set joint parameter
    * ingroup joints
    */
  
    public dJointSetParam(parameter: number, value: number): void {
       
       

        if (this instanceof (DJointHinge)) {            

            Energy.dJointSetHingeParam(this.dxJoint, parameter, value);
        }
        if (this instanceof (DJointHinge2)) {           
            Energy.dJointSetHinge2Param(this.dxJoint, parameter, value);
        }
        if (this instanceof (DJointSlider)) {
           
            Energy.dJointSetSliderParam(this.dxJoint, parameter, value);
        }
        if (this instanceof (DJointBall)) {
            Energy.dJointSetBallParam(this.dxJoint, parameter, value);
        }
           
        // todo ball and transmission parameter   and other joints...    
      /*  if (this instanceof (DJointAMotor)) {
            //Energy.djointset
        }

        if (this instanceof (DJointLMotor)) {
            //Energy.djointset
        }

        if (this instanceof (dJointPiston)) {

        }*/

       // if (this instanceof ())
 

    }

    /**
 * @brief Destroy a joint.
 * @ingroup joints
 *
 * disconnects it from its attached bodies and removing it from the world.
 * However, if the joint is a member of a group then this function has no
 * effect - to destroy that joint the group must be emptied or destroyed.
 */
    public dJointDestroy(): void {  
        Energy.dJointDestroy(this.dxJoint); 

    }
}