import { gql } from '@apollo/client';

export const GET_ONOFF_TIMES = gql`
    query GetTimes {
        times {
            onTime
            offTime
        }
    }
    `;

export const SET_ONOFF_TIMES = gql`
    mutation SetTimes($onTime: String, $offTime: String) {
        setTimes(onTime: $onTime, offTime: $offTime) {
            onTime
            offTime
        }
    }
    `

export const GET_DEVICE_STATUSES = gql`
    query GetDeviceStatuses {
        getDeviceStatuses {
            name
            status
        }
    }
    `

export const SEND_MQTT_MESSAGE = gql`
    mutation SendMQTTMessage ($topic: String!, $message: String!) {
        sendMQTTMessage(topic: $topic, message: $message) 
    }
`

export const GET_MQTT_MESSAGE = gql`
    query GetMQTTMessage ($topic: String!) {
	    getMQTTMessage(topic: $topic) 
    }	
    `

export const GET_CURRENT_USER = gql`
    query GetCurrentUser {
        getCurrentUser
    }
`