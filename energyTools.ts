
// Created samuel girardin @samuelgirardin - 2018
// License Creative Commons Attribution-NonCommercial-ShareAlike 4.0 Unported License.

class EnergyTools {

    // emscripten -  precision.h set dDOUBLE  -> f64 

    private static Mass_ptr: DMass;
    private static DMatrix3_ptr: DMatrix3x3;
    private static feedBack: DJointFeedback;

    static Malloc_Float64Array(f64: Float64Array): Pointer {

        var nDataBytes = f64.length * f64.BYTES_PER_ELEMENT;
        var q = _malloc(nDataBytes);
        var dataHeap = new Uint8Array(Module.HEAPU8.buffer, q, nDataBytes);
        dataHeap.set(new Uint8Array(f64.buffer));
        return q;


    }

    static Malloc_Float32Array(f32: Float32Array): Pointer {




        var nDataBytes = f32.length * f32.BYTES_PER_ELEMENT;
        var q = _malloc(nDataBytes);
        var dataHeap = new Uint8Array(Module.HEAPU8.buffer, q, nDataBytes);
        dataHeap.set(new Uint8Array(f32.buffer));
        return q;


    }

    static Malloc_Int32(uint32: Int32Array): Pointer {



        var nDataBytes = uint32.length * uint32.BYTES_PER_ELEMENT;
        var q = _malloc(nDataBytes);
        var dataHeap = new Uint8Array(Module.HEAPU8.buffer, q, nDataBytes);
        dataHeap.set(new Uint8Array(uint32.buffer));
        return q;

    }
    static Malloc_Vector3(x: number, y: number, z: number): Vector3_Ptr {

        var size = new Float64Array([x, y, z]);
        var nDataBytes = size.length * size.BYTES_PER_ELEMENT;
        var v = _malloc(nDataBytes);
        var dataHeap = new Uint8Array(Module.HEAPU8.buffer, v, nDataBytes);
        dataHeap.set(new Uint8Array(size.buffer));
        return v;

    }


    static Malloc_Quaternion(w: number, x: number, y: number, z: number): Vector4_Ptr {

        var size = new Float64Array([w, x, y, z]);
        var nDataBytes = size.length * size.BYTES_PER_ELEMENT;
        var q = _malloc(nDataBytes);
        var dataHeap = new Uint8Array(Module.HEAPU8.buffer, q, nDataBytes);
        dataHeap.set(new Uint8Array(size.buffer));
        return q;

    }

    static Malloc_new_quaternion(): Vector4_Ptr {


        var size = new Float64Array(4);
        var nDataBytes = size.length * size.BYTES_PER_ELEMENT;
        var q = _malloc(nDataBytes);
        var dataHeap = new Uint8Array(Module.HEAPU8.buffer, q, nDataBytes);
        dataHeap.set(new Uint8Array(size.buffer));

        return q;


    }

    static Malloc_new_Vector3(): Vector3_Ptr {

        var size = new Float64Array(3);
        var nDataBytes = size.length * size.BYTES_PER_ELEMENT;
        var v3 = _malloc(nDataBytes);
        var dataHeap = new Uint8Array(Module.HEAPU8.buffer, v3, nDataBytes);
        dataHeap.set(new Uint8Array(size.buffer));
        return v3;


    }

    static Malloc_dMass_Struct(): DMass {
        var size = new Float64Array(17);
        var nDataBytes = size.length * size.BYTES_PER_ELEMENT;
        var m = _malloc(nDataBytes);
        var dataHeap = new Uint8Array(Module.HEAPU8.buffer, m, nDataBytes);
        dataHeap.set(new Uint8Array(size.buffer));
        return m;
    }

    static Malloc_dMatrix3x3(): DMatrix3x3 {

        var size = new Float64Array(12);
        var nDataBytes = size.length * size.BYTES_PER_ELEMENT;
        EnergyTools.DMatrix3_ptr = _malloc(nDataBytes);
        var dataHeap = new Uint8Array(Module.HEAPU8.buffer, EnergyTools.DMatrix3_ptr, nDataBytes);
        dataHeap.set(new Uint8Array(size.buffer));
        return EnergyTools.DMatrix3_ptr;

    }

    static Malloc_feedback_struct(): DMatrix3x3 {

        var size = new Float64Array(16);
        var nDataBytes = size.length * size.BYTES_PER_ELEMENT;
        EnergyTools.feedBack = _malloc(nDataBytes);
        var dataHeap = new Uint8Array(Module.HEAPU8.buffer, EnergyTools.feedBack, nDataBytes);
        dataHeap.set(new Uint8Array(size.buffer));
        return EnergyTools.feedBack;
    }



    static Free_DMatrix3_Ptr(ptr: Pointer) {
        //_free(ptr);
    }


    static Free_dMass_Struc() {
       // _free(EnergyTools.Mass_ptr);
    }

    static Pointer_To_Vector3(ptr: Vector3_Ptr, swapTOxzy: boolean): Array<number> {

        var x = Module.getValue(ptr + 0, 'double');
        var y = Module.getValue(ptr + 8, 'double');
        var z = Module.getValue(ptr + 16, 'double');

        if (!swapTOxzy) {
            return new Array(x, y, z);
        } else {
            return new Array(x, z, y);
        }
    }

    static Pointer_To_Vector4 (ptr :Vector4_Ptr, isQuaternion:boolean) {
        //TO METHODE FAST
        if (isQuaternion) {
            var w = Module.getValue(ptr + 0, 'double');
            var x = -Module.getValue(ptr + 8, 'double');
            var y = -Module.getValue(ptr + 16, 'double');
            var z = -Module.getValue(ptr + 24, 'double');
        }
        else {
            var w = Module.getValue(ptr + 0, 'double');
            var x = Module.getValue(ptr + 8, 'double');
            var y = Module.getValue(ptr + 16, 'double');
            var z = Module.getValue(ptr + 24, 'double');
        }
        return new Array(w, x, y, z);
    
    }



}