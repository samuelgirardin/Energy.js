
// Created samuel girardin @samuelgirardin - 2018
// License Creative Commons Attribution-NonCommercial-ShareAlike 4.0 Unported License.

class EnergyMath {

    static n_ptr: Vector3_Ptr;
    static p_ptr: Vector3_Ptr;
    static q_ptr: Vector3_Ptr;

   // given a vector, it finds other 2 perpendicular vectors
    static dPlaneSpace(n: BABYLON.Vector3): Array<BABYLON.Vector3> {

        // need to malloc , p: BABYLON.Vector3, q: BABYLON.Vector3
       // if (!EnergyMath.n_ptr && !EnergyMath.n_ptr && !EnergyMath.n_ptr) {

            EnergyMath. n_ptr = EnergyTools.Malloc_Vector3(n.x, n.z, n.y);
            EnergyMath. p_ptr = EnergyTools.Malloc_new_Vector3();
            EnergyMath. q_ptr = EnergyTools.Malloc_new_Vector3();
       // }

            EnergyMath._dPlaneSpace(EnergyMath.n_ptr, EnergyMath.p_ptr, EnergyMath.q_ptr);


            var p: number[] = EnergyTools.Pointer_To_Vector3(EnergyMath.p_ptr, true);
            var q: number[] = EnergyTools.Pointer_To_Vector3(EnergyMath.q_ptr, true);

            console.log(p);
            console.log(q);

            return [new BABYLON.Vector3(p[0], p[1], p[2]), new BABYLON.Vector3(q[0], q[1], q[2])]



         

    }

    public static _dPlaneSpace: (n: Vector3_Ptr, p: Vector3_Ptr,q:Vector3_Ptr) => void = Module.cwrap('dPlaneSpace', '', ['number', 'number', 'number']);


}