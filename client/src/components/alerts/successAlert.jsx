export default function SuccessAlert(props){
    const { message } = props;

    return (
        <div className="success-message">
            {message}
        </div>
    )
}