import { JW_PAYLOAD } from "./payload.interface";

declare global{
    namespace Express{
        interface Request{
            user: JW_PAYLOAD
        }

    }
}