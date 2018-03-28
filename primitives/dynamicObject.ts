

interface DynObject {
     mesh: BABYLON.Mesh | BABYLON.InstancedMesh;
     dxBody: DxBody;
     dxGeom: DxGeom;
     dxMass: DMass;
     dxWorld: DxWorld;
     dxSpace: DxSpace;
     dxMaterial: DxMaterial;
     physicMaterial: PhysicMaterial;
     pointer_pos: Pointer;
     pointer_rot: Pointer;
     dxFlags: Pointer;
     name: string;
     uniqID: number;
     density: number;
     isDisable: boolean;
     geomContact: any[];
}


class DynamicObject {
    public mesh: BABYLON.Mesh | BABYLON.InstancedMesh;
    public dxBody: DxBody;
    public dxGeom: DxGeom;
    public dxMass: DMass;
    public dxWorld: DxWorld;
    public dxSpace: DxSpace;
    public dxMaterial: DxMaterial;
    public physicMaterial: PhysicMaterial;
    public pointer_pos: Pointer;
    public pointer_rot: Pointer;
    public dxFlags: Pointer;
    public name: string;
    public uniqID: number;
    public density: number;
    public isDisable: boolean = false;
    public geomContact: any[] = [];
    public lastTimeStamp: number; 

    public posRq: Array<number> = new Array<number>(7);

    // to avoid multiple var declaration, check when a pointer is being free
    //private _q: number;

    public static Instances: Array<DynamicObject> = new Array<DynamicObject>();
    public static OInstances = <DynObject>{}; 


    /**
     *  contact betwen geomID
     */

    public addContact(timeStamp: number, geomID: DxGeom): void {

        if (timeStamp == this.lastTimeStamp || this.lastTimeStamp == null) {
            this.geomContact.push(geomID);
            this.lastTimeStamp = timeStamp;
        } else {
            this.geomContact = []; 
            this.geomContact.push(geomID);
            this.lastTimeStamp = timeStamp;
        }

       

    }

    public getDxBodyPointersAndFlag(): void {

        //method to implement or not for alll dynamicObject, 
        //for the moment it's done inside for inside dynamicobject Type
        //so this method is not used.

        Energy.dMassAdjust(this.dxMass, this.density);
        Energy.dBodySetMass(this.dxBody, this.dxMass);
        Energy.dGeomSetBody(this.dxGeom, this.dxBody);
        this.pointer_pos = Energy.dBodyGetPosition(this.dxBody);
        this.pointer_rot = Energy.dBodyGetQuaternion(this.dxBody);

        //TODO write the safe method useful or not - don t remember
        this.dxFlags = Energy.dBodyGetDxFlags(this.dxBody);

        //TODO not sure it's doing something good ;
        EnergyTools.Free_dMass_Struc();
    }



    /** Assign a physicMaterial to the geom
    */
    public dGeomSetMaterial(pmat: PhysicMaterial): void {

        if (this.dxGeom != null) {
            this.physicMaterial = pmat;
            this.dxMaterial = this.physicMaterial.dxMaterial;

            Energy.dGeomSetMaterial(this.dxGeom, this.physicMaterial.dxMaterial);
        } else {
            console.log("assign material failed, dxGeom is null");
        }
    }




    /**
    * @brief Set position of a body.
    * @ always use dGeomSetPosition () body and geom are updated
    */

    public dBodySetPosition(x: number, y: number, z: number) {
        // deal for static object 

        // #IF SAFE
        // Energy.dBodySetPosition(this.dxBody, x, y, z);
        // #IF FAST
        Module._dBodySetPosition(this.dxBody, x, y, z);


    }


    /**
    * @brief Set the orientation of a body.
    * @param DMatrix3x3
    * @ingroup bodies
    * @remarks
    * After setting, the outcome of the simulation is undefined
    * if the new configuration is inconsistent with the joints/ constraints
    * that are present.
    */
    public dBodySetRotation(R: DMatrix3x3): void {
        Energy.dBodySetRotation(this.dxBody, R);
    }


    /**
    * @brief Set the orientation of a body or a Geom
    * @ingroup bodies
    * @remarks
    * After setting, the outcome of the simulation is undefined
    * if the new configuration is inconsistent with the joints/constraints
    * that are present.
    */
    public dBodySetQuaternion(w: number, x: number, y: number, z: number): void {
        // deal for static object          

        var q = EnergyTools.Malloc_Quaternion(w, x, y, z);
        // #IF SAFE
        // Energy.dBodySetQuaternion(this.dxBody, this.q);
        // #IF FAST
        Module._dBodySetQuaternion(this.dxBody, q);

        // _free(this._q);

    }

    /**
    * brief Set the position vector of a placeable geom.
    *
    * If the geom is attached to a body, the body's position will also be changed.
    * Calling this function on a non-placeable geom results in a runtime error
    */
    public dGeomSetPosition(x: number, y: number, z: number) {

        // #IF SAFE
        //Energy.dGeomSetPosition(this.dxGeom, x, y, z);
        // #IF FAST
        Module._dGeomSetPosition(this.dxGeom, x, y, z);

    }

    /**
 * @brief Get the position vector of a placeable geom. *
 * If the geom is attached to a body, the body's position will be returned. *
 * Calling this function on a non-placeable geom results in a runtime error
 *
 */
    public dGeomGetPosition(): Array<number> {
        //TODO check if its geom or body not really important

        // #IF SAFE
        // return EnergyTools.Pointer_To_Vector3(Energy.dGeomGetPosition(this.dxGeom), true);
        // #IF FAST
        return [Module.HEAPF64[((this.pointer_pos) >> 3)], Module.HEAPF64[((this.pointer_pos + 16) >> 3)], Module.HEAPF64[((this.pointer_pos + 8) >> 3)]]

    }

    /**
    * @brief Get the rotation quaternion of a placeable geom.    
    * If the geom is attached to a body, the body's quaternion will be returned.    
    * Calling this function on a non-placeable geom results in a runtime error
    */
    public dGeomGetQuaternion(): Array<number> {

        // #IF SAFE
        var q = EnergyTools.Malloc_new_quaternion();
        Energy.dGeomGetQuaternion(this.dxGeom, q);

        return EnergyTools.Pointer_To_Vector4(q, true);
        // #IF FAST
        //return [Module.HEAPF64[((this.pointer_rot) >> 3)], - Module.HEAPF64[((this.pointer_rot + 8) >> 3)], - Module.HEAPF64[((this.pointer_rot + 16) >> 3)], - Module.HEAPF64[((this.pointer_rot + 24) >> 3)]]

    }



    public dGeomSetQuaternion(w: number, x: number, y: number, z: number) {

        //TODO update and not malloc new quat each time
        //This is rarely the case but a geom rotate each frame
        //so update and no malloc

        if (this.dxBody != null) {
            var q = EnergyTools.Malloc_Quaternion(w, x, y, z);
            // #IF SAFE 
            //TODO better to update that create a new one           
            Energy.dBodySetQuaternion(this.dxBody, q);
            // #IF FAST
            //Module._dBodySetQuaternion(this.dxBody, q);

            //TODO check that
            //_free(q);

        } else {
            var q = EnergyTools.Malloc_Quaternion(w, x, y, z);
            Energy.dGeomSetQuaternion(this.dxGeom, q);
            this.pointer_rot = q;


            //Best way to do, but in update case ode is not notify the quaternion change
            /*if (this.pointer_rot == null) {
                // we have to malloc a new q
                console.log("cas geom et pointerrot null")
                var q = EnergyTools.Malloc_Quaternion(w, x, y, z);
                Energy.dGeomSetQuaternion(this.dxGeom, q);
                this.pointer_rot = q; 
            } else {
                console.log("cas geom pointer ok donc update");
                EnergyTools.UpdateQuaternion(this.pointer_rot, w, x, y, z); 
            }*/


            // #IF FAST
            // Module._dGeomSetQuaternion(this.dxGeom, q);
        }
    }





    /**
    * @brief Set the body torque accumulation vector.
    * @remarks
    * This is mostly useful to zero the force and torque for deactivated bodies
    * before they are reactivated, in the case where the force-adding functions
    * were called on them while they were deactivated.
    * @ingroup bodies
    */
    public dBodySetLinearVel(x: number, y: number, z: number): void {

        Energy.dBodySetLinearVel(this.dxBody, x, y, z);
    }

    /**
    * @brief Set the angular velocity of a body.
    * @ingroup bodies
    */
    public dBodySetAngularVel(x: number, y: number, z: number): void {

        Energy.dBodySetAngularVel(this.dxBody, x, y, z);

        //  Energy.dBodyAddRelTorque
        //   Energy.dBodyAddTorque
        //  Energy.dBodyAddForce

    }


    /**
    * brief Add force at centre of mass of body in absolute coordinates.
    * ingroup bodies
    * Local = true functions take force vectors that are relative to the body's own frame of reference.
    */
    public dBodyAddForce(fx: number, fy: number, fz: number, useLocal: boolean) {



        if (useLocal) {
            Energy.dBodyAddRelForce(this.dxBody, fx, fy, fz);
        } else {



            Energy.dBodyAddForce(this.dxBody, fx, fy, fz);
        }
    }

    public dBodyGetForce(): Array<number> {
        return EnergyTools.Pointer_To_Vector3(Energy.dBodyGetForce(this.dxBody), true);
    }

    /**
    * @brief Set the body force accumulation vector.
    * @remarks
    * This is mostly useful to zero the force and torque for deactivated bodies
    * before they are reactivated, in the case where the force-adding functions
    * were called on them while they were deactivated.
    * @ingroup bodies
    */
    public dBodySetForce(fx: number, fy: number, fz: number) {
        Energy.dBodySetForce(this.dxBody, fx, fy, fz);
    }


    /**
    * brief Add torque at centre of mass of body in absolute coordinates.
    * ingroup bodies
    * Local = true functions take force vectors that are relative to the body's own frame of reference.
    */
    public dBodyAddTorque(fx: number, fy: number, fz: number, useLocal: boolean) {

        if (useLocal) {
            Energy.dBodyAddRelTorque(this.dxBody, fx, fy, fz);
        } else {
            Energy.dBodyAddTorque(this.dxBody, fx, fy, fz);
        }
    }

    /**
    * @brief Set the body force accumulation vector.
    * @remarks
    * This is mostly useful to zero the force and torque for deactivated bodies
    * before they are reactivated, in the case where the force-adding functions
    * were called on them while they were deactivated.
    * @ingroup bodies
    */
    public dBodySetTorque(fx: number, fy: number, fz: number) {
        Energy.dBodySetTorque(this.dxBody, fx, fy, fz);
    }


    public dBodySetFiniteRotationMode(v: number) {
        Energy.dBodySetFiniteRotationMode(this.dxBody, v);
    }


    public dBodySetGyroscopicMode(v: number) {
        Energy.dBodySetGyroscopicMode(this.dxBody, v);
    }





    public dBodyGetTorque(): Array<number> {
        return EnergyTools.Pointer_To_Vector3(Energy.dBodyGetTorque(this.dxBody), true);
    }

    public dBodyGetLinearVel(): Array<number> {
        return EnergyTools.Pointer_To_Vector3(Energy.dBodyGetLinearVel(this.dxBody), true);
    }


    public dBodyGetAngularVel(): Array<number> {
        return EnergyTools.Pointer_To_Vector3(Energy.dBodyGetAngularVel(this.dxBody), true);
    }

    public dBodyIsEnabled(): number {
        //TODO write the safe the method, HEAP32 or HEAPU32 ?
        return Module.HEAP32[((this.dxFlags) >> 2)] & dxBodyDisabled;

    }
    /**
     * 
     * @param interval = a body will communicate is state enabled or disabled at the interval/(stepsize*numstep) in s
     * exeption : if the body is disabled and it's state stay the same during the interval, he will stop communicate.
     * Is this same disable object after this long idle time change to enable (collision, force), he will comunicate
     * automatically the state enable. 
     */
    public dBodySetNotification_interval(interval: number) {
        Energy.dBodySetNotification_interval(this.dxBody, interval);
    }




    public destroyDynamicObject(): void {

        if (this.dxGeom) {
            this.dGeomDestroy();
            this.dxGeom = null;
        };

        if (this.dxBody) {
            this.dBodyDestroy();
            this.dxBody = null;
        }

    }
    //public dBodyIsEnabled(): number {
    //    //TODO write the safe the method, HEAP32 or HEAPU32 ?
    //    return Module.HEAP32[((this.pointer_flag) >> 2)] & dxBodyDisabled;

    //}

    public dBodyGetFlags(): number {
        //TODO Get pointer flags for a other methode
        return Energy.dBodyGetFlags(this.dxBody);
    }
    public dBodySetFlags(flags: number) {
        // on c side the set is done flag |= new value
        Energy.dBodySetFlags(this.dxBody, flags);

    }

    private dBodyDestroy(): void {
        // #SAFE
        //Energy.dBodyDestroy(this.dxBody);
        // #FAST
        Module._dBodyDestroy(this.dxBody);
    }

    private dGeomDestroy(): void {
        // #SAFE
        //Energy.dGeomDestroy(this.dxGeom);
        // #FAST
        Module._dGeomDestroy(this.dxBody);
    }

    public dBodyGetMass(): number {

        //NOTE SAFE
        return Module.HEAPF64[((this.dxMass) >> 3)];
    }


    public dBodySetMass(density: number): void {

        this.density = density;
        Energy.dMassAdjust(this.dxMass, this.density);
        Energy.dBodySetMass(this.dxBody, this.dxMass);

    }

    public getPosRqDouble(): Array<number> {

        //maybe use dataview for Edge, faster than getValue, not true in chrome && FF

        this.posRq[0] = Module.getValue(this.pointer_pos + 0, 'double');
        this.posRq[1] = Module.getValue(this.pointer_pos + 8, 'double');
        this.posRq[2] = Module.getValue(this.pointer_pos + 16, 'double');

        this.posRq[3] = Module.getValue(this.pointer_rot + 0, 'double');
        this.posRq[4] = - Module.getValue(this.pointer_rot + 8, 'double');
        this.posRq[5] = - Module.getValue(this.pointer_rot + 16, 'double');
        this.posRq[6] = -Module.getValue(this.pointer_rot + 24, 'double');


        return this.posRq;
    }

    public getPosRqSingle(): Array<number> {

        //maybe use dataview for Edge, faster than getValue, not true in chrome && FF

        this.posRq[0] = Module.getValue(this.pointer_pos + 0, 'float');
        this.posRq[1] = Module.getValue(this.pointer_pos + 4, 'float');
        this.posRq[2] = Module.getValue(this.pointer_pos + 8, 'float');

        this.posRq[3] = Module.getValue(this.pointer_rot + 0, 'float');
        this.posRq[4] = - Module.getValue(this.pointer_rot + 4, 'float');
        this.posRq[5] = - Module.getValue(this.pointer_rot + 8, 'float');
        this.posRq[6] = -Module.getValue(this.pointer_rot + 12, 'float');


        return this.posRq;
    }


    /** Is idsable notification from 'c++'
    change the name of the method
   */

    public static NotifyState(pointer: DxBody): void {



        for (var i = 0; i < DynamicObject.Instances.length; i++) {
            if (pointer == DynamicObject.Instances[i].dxBody) {
                //  console.log("state", pointer);
              //  DynamicObject.Instances[i].isDisable = true;
              //  DynamicObject.Instances[i].mesh.isVisible = false;
              //  DynamicObject.Instances[i].mesh.getChildMeshes()[0].isVisible = true;



                break;
            }
        }
    }

    public static NotifyState2(pointer: DxBody): void {



        for (var i = 0; i < DynamicObject.Instances.length; i++) {
            if (pointer == DynamicObject.Instances[i].dxBody) {
                //    console.log("state 2  ", pointer);
              //  DynamicObject.Instances[i].isDisable = false;
             //   DynamicObject.Instances[i].mesh.isVisible = true;
             //   DynamicObject.Instances[i].mesh.getChildMeshes()[0].isVisible = false;

                break;
            }

        }
    }



}