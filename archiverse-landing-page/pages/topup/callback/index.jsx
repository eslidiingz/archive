import { useCallback, useEffect } from "react";
import Swal from "sweetalert2";

const TopUpCallBack = () => {
    const callBack = useCallback(() => {
        const init = () => {
            Swal.fire("Success", "Payment successfully", 'success');
            setTimeout(() => {
                location.reload();
            }, 2000)
        }
        init();
    }, [])
    useEffect(() => {
        callBack()
    }, [])
    return (
        <>
        </>
    );
}

export default TopUpCallBack;