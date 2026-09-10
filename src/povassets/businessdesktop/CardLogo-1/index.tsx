import imgCardLogo from "./b36ae9b39c1e77f2a059802c3c17876c029a83a1.png";

export default function CardLogo() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[22px] size-full" data-name="card-logo">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[22px] size-full" src={imgCardLogo} />
    </div>
  );
}