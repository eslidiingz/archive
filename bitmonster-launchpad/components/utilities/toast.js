import {toast} from "react-toastify"
import {ToastDisplay} from "./toast-display"

export function toastWaiting() {
  return toast(
    <ToastDisplay
      type={"process"}
      title={"Waiting For Confirmation"}
      description={"Confirm this transaction in your wallet"}
    />
  )
}

export function toastSuccess() {
  return toast(
    <ToastDisplay
      type={"success"}
      title={"Transaction reciept"}
      description={"Transaction reciept"}
    />
  )
}

export function toastDanger(error) {
  return toast(
    <ToastDisplay
      type={"error"}
      title={"Transaction failed"}
      description={error.message}
    />
  )
}
