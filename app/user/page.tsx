import { auth } from "@/auth";
import UserNotFound from "@/components/UserNotFound";
import UserProfile from "@/components/UserProfile";
import ClientAuthCheck from "@/services/ClientAuthCheck";

export default async function Page() {
  const session = await auth();

  

  return (
    <div className="w-full h-[100vh] p-4 flex flex-col items-center justify-center overflow-hidden">

      {session?.user?.email && <ClientAuthCheck email={session.user.email} />}

      {session ? <UserProfile /> : <UserNotFound />}
    </div>
  );
}
