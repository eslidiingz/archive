import { useCountdown } from "../../hooks/useCountDown";



const CountDownBox = ({ targetDate, expiredCallback }) => {
    const [days, hours, minutes, seconds] = useCountdown(targetDate / 1000);
    if(days == 0 && hours == 0 && minutes == 0 && seconds == 0){
        setTimeout(() => {
            expiredCallback()
        }, 1000)
    }
    return `Days ${days}, ${hours}h : ${minutes}m : ${seconds}s`;
}


export default CountDownBox;