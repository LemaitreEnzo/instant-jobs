import "./ApplicationsRow.css"
import type { PropsApplications } from "../../../types/props.type";
import Tag from "../../ui/Tag/Tag";

function ApplicationsRow({ ...props }: PropsApplications) {
    
    const formatDate = (value: Date | string) => {
        if (!value) {
            return "Aucune relance"
        }

        const date = new Date(value);
        return date.toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        })
    }

    const getType = (type: string) => {
        if (type === "ALTERNANCE") {
            return "tag-primary";
        }

        if (type === "STAGE") {
            return "tag-terciary";
        }

        return "tag-terciary";
    }

    const getStatus = (status: string) => {
        if (status === "Acceptée") {
            return "tag-success";
        }

        if (status === "En attente") {
            return "tag-warn";
        }

        if (status === "Refusée") {
            return "tag-error";
        }

        return "tag-terciary";
    }

    const getResend = (resend: string) => {
        if (resend === "Relancée" ) {
            return "tag-success";
        }

        if (resend === "Pas de relance") {
            return "tag-error";
        }

        if (resend === "Entretien passé") {
            return "tag-primary";
        }

        return "tag-none";
    }

    return (
        <div className="applications-row">
            <div className="applications-company">
                <img src={props.logo} alt={props.name} />
                <p>{props.name}</p>
            </div>
            <p>{formatDate(props.sendDate)}</p>
            <p>{props.city}</p>
            <p>{props.company}</p>
            <Tag className={getType(props.type)}>
                <span>{props.type}</span>
            </Tag>
            <Tag className={getStatus(props.status)}>
                <span>{props.status}</span>
            </Tag>
            <Tag className={getResend(props.resend)}>
                <span>{props.resend}</span>
            </Tag>
            <p>{formatDate(props.resendDate)}</p>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.8 18.3C10.8 17.9022 10.9581 17.5206 11.2394 17.2393C11.5207 16.958 11.9022 16.8 12.3 16.8C12.6979 16.8 13.0794 16.958 13.3607 17.2393C13.642 17.5206 13.8 17.9022 13.8 18.3C13.8 18.6978 13.642 19.0793 13.3607 19.3607C13.0794 19.642 12.6979 19.8 12.3 19.8C11.9022 19.8 11.5207 19.642 11.2394 19.3607C10.9581 19.0793 10.8 18.6978 10.8 18.3ZM10.8 12.3C10.8 11.9022 10.9581 11.5206 11.2394 11.2393C11.5207 10.958 11.9022 10.8 12.3 10.8C12.6979 10.8 13.0794 10.958 13.3607 11.2393C13.642 11.5206 13.8 11.9022 13.8 12.3C13.8 12.6978 13.642 13.0793 13.3607 13.3606C13.0794 13.642 12.6979 13.8 12.3 13.8C11.9022 13.8 11.5207 13.642 11.2394 13.3606C10.9581 13.0793 10.8 12.6978 10.8 12.3ZM10.8 6.29999C10.8 5.90216 10.9581 5.52063 11.2394 5.23933C11.5207 4.95802 11.9022 4.79999 12.3 4.79999C12.6979 4.79999 13.0794 4.95802 13.3607 5.23933C13.642 5.52063 13.8 5.90216 13.8 6.29999C13.8 6.69781 13.642 7.07934 13.3607 7.36065C13.0794 7.64195 12.6979 7.79999 12.3 7.79999C11.9022 7.79999 11.5207 7.64195 11.2394 7.36065C10.9581 7.07934 10.8 6.69781 10.8 6.29999Z" fill="currentColor" />
            </svg>
        </div>
    )
}

export default ApplicationsRow