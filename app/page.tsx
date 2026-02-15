import {Footer} from "@/components/navigation/footer";
import {Header} from "@/components/navigation/header";

export default function Home() {
  return (
      <div className={"h-screen"}>

          <main className="w-full h-full flex items-center flex-col">
              <Header />

              <div className="flex h-full w-full items-center justify-center">
                  <p className="font-bold text-8xl">Welcome</p>
              </div>
          </main>

          <Footer />
      </div>
  );
}
