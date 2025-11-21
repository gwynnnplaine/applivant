import { db } from "@/db"
import { APPLICATION_STATUS } from "@/entities/application-status"
import { JobApplication } from "@/entities/job-application"
import { JOB_TYPE } from "@/entities/job-type"
import { useLiveQuery } from "dexie-react-hooks"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 text-2xl font-bold"></div>
  )
}
