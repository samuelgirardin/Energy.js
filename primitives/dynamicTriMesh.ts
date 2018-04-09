
// Created samuel girardin @samuelgirardin - 2018
// License Creative Commons Attribution-NonCommercial-ShareAlike 4.0 Unported License.
class dynamicTriMesh extends DynamicObject {

    private dxTriMeshData: DxTriMeshData; 
  

    constructor(dxSpace: DxSpace, dxWorld: DxWorld, vertices: Float32Array, indices: Int32Array, density: number, uniqID: number, name :string) {

        super();

       
        //TODO check density, weird behaviour ...

        this.dxWorld = dxWorld;
        this.dxSpace = dxSpace;            
        this.uniqID = uniqID;
        this.name = name;
        this.density = density;

     

        // allocate mem for this two pointers  
        var verticesPointer = EnergyTools.Malloc_Float32Array(vertices);               
        var indicesPointer = EnergyTools.Malloc_Int32(indices);
        
        // Both Opcode and Gimpact version  - carrefull to the TriStride was indices.BYTES_PER_ELEMENT for opcode. 
        this.dxTriMeshData = Energy.dGeomTriMeshDataCreate();
        Energy.dGeomTriMeshDataBuildSingle(this.dxTriMeshData, verticesPointer, vertices.BYTES_PER_ELEMENT * 3, vertices.length / 3, indicesPointer, indices.length, indices.BYTES_PER_ELEMENT);      
        this.dxGeom = Energy.dCreateTriMesh(this.dxSpace, this.dxTriMeshData, 0, 0, 0);   

        // create body and allocate mass
        if (this.density != 0) {
            this.dxBody = Energy.dBodyCreate(this.dxWorld);
            this.dxMass = EnergyTools.Malloc_dMass_Struct();
            this.pointer_pos = Energy.dBodyGetPosition(this.dxBody);
            this.pointer_rot = Energy.dBodyGetQuaternion(this.dxBody);
            Energy.dMassSetTrimesh(this.dxMass, this.density, this.dxGeom);
            Energy.dGeomSetBody(this.dxGeom, this.dxBody);

            var mc: Array<number> = EnergyTools.Pointer_To_Vector3(this.dxMass + 8, false);       
            Energy.dMassTranslate(this.dxMass, -mc[0], -mc[1], -mc[2]);             
            Energy.dBodySetMass(this.dxBody, this.dxMass);

        } else {
            this.pointer_pos = Energy.dGeomGetPosition(this.dxGeom);
            this.pointer_rot = EnergyTools.Malloc_new_quaternion();
            Energy.dGeomGetQuaternion(this.dxGeom, this.pointer_rot);
        }  

        // assign the default material 
        this.dGeomSetMaterial(PhysicMaterial.GetDefault());

      

        // TODo erase those '''unit test'''

       /* Energy.dGeomSetBounce(this.dxGeom, 667); 
        console.log(Energy.dGeomGetBounce(this.dxGeom)); 

        Energy.dGeomSetBounceVel(this.dxGeom, 668);      
        console.log(Energy.dGeomGetBounceVel(this.dxGeom)); 

        // we add now surface parameter 
        Energy.dGeomSetSoft_erp(this.dxGeom, 669);
        console.log(Energy.dGeomGetSoft_erp(this.dxGeom));

        Energy.dGeomSetSoft_cfm(this.dxGeom, 670);       
        console.log(Energy.dGeomGetSoft_cfm(this.dxGeom)); 

        Energy.dGeomSetRho(this.dxGeom, 671);        
        console.log(Energy.dGeomGetRho(this.dxGeom));

        Energy.dGeomSetRho2(this.dxGeom, 672);
        console.log(Energy.dGeomGetRho2(this.dxGeom));

        Energy.dGeomSetRhoN(this.dxGeom, 673);
        console.log(Energy.dGeomGetRhoN(this.dxGeom));

        Energy.dGeomSetMotion1(this.dxGeom, 674);
        console.log(Energy.dGeomGetMotion1(this.dxGeom));

        Energy.dGeomSetMotion2(this.dxGeom, 675);
        console.log(Energy.dGeomGetMotion2(this.dxGeom));

        Energy.dGeomSetMotionN(this.dxGeom, 676);
        console.log(Energy.dGeomGetMotionN(this.dxGeom));

        Energy.dGeomSetSlip1(this.dxGeom, 677);
        console.log(Energy.dGeomGetSlip1(this.dxGeom));

        Energy.dGeomSetSlip2(this.dxGeom, 678);
        console.log(Energy.dGeomGetSlip2(this.dxGeom));

        Energy.dGeomSetMu(this.dxGeom, 679);
        console.log(Energy.dGeomGetMu(this.dxGeom));

        Energy.dGeomSetMu2(this.dxGeom, 680);
        console.log(Energy.dGeomGetMu2(this.dxGeom));
        */

        

         // read value c0,c1,c2 from dxmass fro translation process,         
        /* var mc: Array<number> = EnergyTools.Pointer_To_Vector3(this.dxMass + 8, false); 
         Energy.dGeomSetOffsetPosition(this.dxGeom, -mc[0], -mc[1], -mc[2]);
         Energy. dMassTranslate(this.dxMass, -mc[0], -mc[1], -mc[2]);   
         DynamicObject.Instances.push(this);
        */
        DynamicObject.Instances.push(this);

    }

}