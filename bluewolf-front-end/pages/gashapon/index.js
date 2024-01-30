import { useEffect } from "react";
import Mainlayout from "../../components/layouts/Mainlayout";
import Card from "../../components/card/CardGashapon"


const Gashapon = () => {
    const cardGashapon = [
        {
            title: "Try.Out.Illustration.",
            creator: "@Cristhian Ramírez",
            description: "This is an exploration in Procreate. With a comun point in the pieces, the metaphor.",
            cover: "assets/image/asset-2.png",
            profile: "assets/image/01.png",
            href: "/gashapon/detail"
        },
        {
            title: "The killing moon", 
            creator: "@Ximena Arias",
            description: "Blasted with ecstasy: O, woe is me, To have seen what I have seen, see what I see!",
            cover: "assets/image/afeb4b73627bc8cc52cdfa51f2e64b72.png",
            profile: "assets/image/02.png",
            href: "/gashapon/detail",
        },
        {
            title: "Ophelia",
            creator: "@Alessia Trunfio",
            description: "…And I, of ladies most deject and wretched, That suck’d the honey of his music vows,",
            cover: "assets/image/e91fccab1816c618880076ef6aefb526.png",
            profile: "assets/image/03.png",
            href: "/gashapon/detail",
        },
        {
            title: "Resting Place",
            creator: "@Mart Biemans",
            description: "This is an exploration in Procreate. With a comun point in the pieces, the metaphor.",
            cover: "assets/image/45ae10fe69c7ec4f1f92d189a735e842.png",
            profile: "assets/image/04.png",
            href: "/gashapon/detail",
        },
        {
            title: "Sketch vs Moon",
            creator: "@Olivier Menanteau",
            description: "Blasted with ecstasy: O, woe is me, To have seen what I have seen, see what I see!",
            cover: "assets/image/9b81c9ed3c365716330d8622f3069961.png",
            profile: "assets/image/05.png",
            href: "/gashapon/detail",
        }
      ];
    
    return (
        <>
            {/* Content All*/}
            <section className="events">
                <div className="container">
                    <div className="row my-4">
                        <div className="col-12 text-center">
                            <h2 className=" my-4 my-md-5">Gashapon</h2>
                        </div>
                        {cardGashapon.map((item, key) => {
                            return (
                                item && (
                                    <div className="col-12 col-md-6 col-lg-4">
                                        <Card 
                                            title={item.title}
                                            creator={item.creator}
                                            description={item.description}
                                            cover={item.cover}
                                            profile={item.profile}
                                            href={item.href}>
                                        </Card>
                                    </div>
                                )
                            );
                        })}
                    </div>
                </div>
            </section>
            {/* End-Content All*/}
        </>
    );
};

export default Gashapon;
Gashapon.layout = Mainlayout;
