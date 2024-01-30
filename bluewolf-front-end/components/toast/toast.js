import {toast} from "react-toastify"
import {ToastDisplay} from "./toast-display"

export function toastWaiting(title, description) {
  return toast(
    <ToastDisplay type={"process"} title={title} description={description} />
  )
}

export function toastSuccess(title, description) {
  return toast(
    <ToastDisplay type={"success"} title={title} description={description} />
  )
}

export function toastDanger(title, description) {
  return toast(
    <ToastDisplay type={"error"} title={title} description={description} />
  )
}
