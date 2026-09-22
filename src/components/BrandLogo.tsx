import Image from "next/image";

export function BrandLogo() {
  return (
    <div className="bg-fg grid h-10  w-10 shrink-0 place-items-center rounded-sm ">
      <Image src={"/logo-light.svg"} width={25} height={25} alt="logo"/>
    </div>
  )
}
