
// Created samuel girardin @samuelgirardin - 2018
// License Creative Commons Attribution-NonCommercial-ShareAlike 4.0 Unported License.
class DynamicBox extends DynamicObject {

    private lx: number = 0;
    private ly: number = 0;
    private lz: number = 0;

  



    constructor(mesh: BABYLON.Mesh | BABYLON.InstancedMesh, dxSpace: DxSpace, dxWorld: DxWorld, density: number, lx: number, ly: number, lz: number, uniqID: number, name: string = "") {

        super();
        this.mesh = mesh; 
        this.dxWorld = dxWorld;
        this.density = density;
        this.dxSpace = dxSpace;
        this.density = density

        this.uniqID = uniqID;
        this.name = name;

        this.lx = lx;
        this.ly = ly;
        this.lz = lz;

        // we deal now for with dynamic object (geom+body) or static object (only geom) 
        this.dxGeom = Energy.dCreateBox(this.dxSpace, this.lx, this.ly, this.lz);

        if (density != 0) {
            this.dxBody = Energy.dBodyCreate(this.dxWorld);
            this.dxMass = EnergyTools.Malloc_dMass_Struct();
            Energy.dMassSetBox(this.dxMass, this.density, this.lx, this.ly, this.lz);
            Energy.dMassAdjust(this.dxMass, this.density);
            Energy.dBodySetMass(this.dxBody, this.dxMass);
            Energy.dGeomSetBody(this.dxGeom, this.dxBody);
            this.pointer_pos = Energy.dBodyGetPosition(this.dxBody);
            this.pointer_rot = Energy.dBodyGetQuaternion(this.dxBody);
          
            EnergyTools.Free_dMass_Struc();

           // console.log(Module.HEAPF64[((this.dxMass) >> 3)]); 



            //TODO write the safe method useful or not
            //this.dxFlags = Energy.dBodyGetDxFlags(this.dxBody);

            //Set the flag for notifyState
          //  Energy.dBodySetFlags(this.dxBody, dxBodyStateNotifyEnergy);

            //TODO check this is commented
         
        } else {
            this.pointer_pos = Energy.dGeomGetPosition(this.dxGeom);
            this.pointer_rot = EnergyTools.Malloc_new_quaternion();
            Energy.dGeomGetQuaternion(this.dxGeom, this.pointer_rot);
        }
        // assign the default material 
        this.dGeomSetMaterial(PhysicMaterial.GetDefault());

        DynamicObject.Instances.push(this);
        DynamicObject.OInstances[this.dxGeom] = this; 


       


    }



}