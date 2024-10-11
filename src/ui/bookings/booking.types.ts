type discoveryResponse = {
  id: string,
  question: string,
  answer: string
}
export type Booking = {
  id: string,
  date: string,
  contact: {
    id: string,
    email: string,
    discoveryResponses?: discoveryResponse[]
  },
  domain: {
    id: string,
    name: string
  }
}