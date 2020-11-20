import SkinAnimation from './SkinAnimation';
import SkinCape from './SkinCape';
import SkinImage from './SkinImage';
import SkinPersona from './skin-persona/SkinPersona';
import SkinPersonaPiece from './skin-persona/SkinPersonaPiece';
import SkinPersonaPieceTintColor from './skin-persona/SkinPersonaPieceTintColor';

interface Image {
    ImageWidth: number;
    ImageHeight: number;
    Image: string;
}

interface AnimatedImageData extends Image {
    Frames: number;
    Type: number;
    AnimationExpression: number;
}

interface PersonaPiece {
    IsDefault: boolean;
    PackId: string;
    PieceId: string;
    PieceType: string;
    ProductId: string;
}

interface PieceTintColor {
    Colors: Array<string>;
    PieceType: string;
}

interface JWT {
    SkinId: string;
    CapeId: string;
    SkinResourcePatch: string;
    SkinImageHeight: number;
    SkinImageWidth: number;
    SkinGeometryData: string;
    SkinAnimationData: string;
    CapeImageHeight: number;
    CapeImageWidth: number;
    CapeOnClassicSkin: boolean;
    SkinData: string;
    CapeData: string;
    PremiumSkin: boolean;
    PersonaSkin: boolean;
    SkinColor: string;
    ArmSize: string;
    AnimatedImageData: Array<AnimatedImageData>;
    PersonaPieces: Array<PersonaPiece>;
    PieceTintColors: Array<PieceTintColor>;
}

export default class Skin {
    private id!: string;
    private resourcePatch!: string;
    private image!: SkinImage;
    private animations: Set<SkinAnimation> = new Set();
    private cape!: SkinCape;
    private geometry!: string;
    private animationData!: string;
    private premium!: boolean;
    private persona!: boolean;
    private capeOnClassicSkin!: boolean;
    private color: string = '#0';
    private armSize: string = 'wide';
    private personaData!: SkinPersona;

    /**
     * Full skin ID, computed because
     * not sent on JWT.
     */
    public fullId!: string;
    public isTrusted: boolean = true;

    /**
     * Loads a skin from a JSON file contianing skin data
     * using minecraft bedrock login fields.
     *
     * (loads the skin persona)
     */
    public static fromJWT(jwt: JWT): Skin {
        let skin = new Skin();

        // Read skin
        skin.id = jwt.SkinId;
        skin.resourcePatch = Buffer.from(
            jwt.SkinResourcePatch,
            'base64'
        ).toString();
        skin.image = new SkinImage({
            width: jwt.SkinImageWidth,
            height: jwt.SkinImageHeight,
            data: Buffer.from(jwt.SkinData, 'base64')
        });
        skin.color = jwt.SkinColor;
        skin.armSize = jwt.ArmSize;

        // Read animations
        for (let animation of jwt.AnimatedImageData) {
            skin.animations.add(
                new SkinAnimation({
                    image: new SkinImage({
                        width: animation.ImageWidth,
                        height: animation.ImageHeight,
                        data: Buffer.from(animation.Image, 'base64')
                    }),
                    frames: animation.Frames,
                    type: animation.Type,
                    expression: animation.AnimationExpression
                })
            );
        }

        // Read cape
        skin.cape = new SkinCape({
            id: jwt.CapeId,
            image: new SkinImage({
                width: jwt.CapeImageWidth,
                height: jwt.CapeImageHeight,
                data: Buffer.from(jwt.CapeData, 'base64')
            })
        });

        // TODO: make a class to manage geometry
        skin.geometry = Buffer.from(jwt.SkinGeometryData, 'base64').toString();

        // TODO: Most of the times is empty, figure out what is it
        skin.animationData = Buffer.from(
            jwt.SkinAnimationData,
            'base64'
        ).toString();

        // Read skin boolean properties
        skin.premium = jwt.PremiumSkin;
        skin.persona = jwt.PersonaSkin;
        skin.capeOnClassicSkin = jwt.CapeOnClassicSkin;

        // Avoid reading when skin is not persona type
        if (skin.persona) {
            skin.personaData = new SkinPersona();

            // Read persona pieces
            for (let personaPiece of jwt.PersonaPieces) {
                skin.personaData.getPieces().add(
                    new SkinPersonaPiece({
                        def: personaPiece.IsDefault,
                        packId: personaPiece.PackId,
                        pieceId: personaPiece.PieceId,
                        pieceType: personaPiece.PieceType,
                        productId: personaPiece.ProductId
                    })
                );
            }

            // Read piece tint colors
            for (let pieceTintColor of jwt.PieceTintColors) {
                let tintColor = new SkinPersonaPieceTintColor();
                tintColor.getColors().push(...pieceTintColor.Colors);
                tintColor.setPieceType(pieceTintColor.PieceType);
                skin.personaData.getTintColors().add(tintColor);
            }
        }

        // Compute a full id
        skin.fullId = skin.getCape().getId() + skin.id;
        return skin;
    }

    public getId(): string {
        return this.id;
    }

    public getFullId(): string {
        return this.fullId ?? this.getCape().getId() + this.getId();
    }

    public getResourcePatch(): string {
        return this.resourcePatch;
    }

    public getImage(): SkinImage {
        return this.image;
    }

    public getAnimations(): Set<SkinAnimation> {
        return this.animations;
    }

    public getAnimationData(): string {
        return this.animationData;
    }

    public isPersona(): boolean {
        return this.persona;
    }

    public isPremium(): boolean {
        return this.premium;
    }

    public isCapeOnClassicSkin(): boolean {
        return this.capeOnClassicSkin;
    }

    public getColor(): string {
        return this.color;
    }

    public getArmSize(): string {
        return this.armSize;
    }

    public getPersonaData(): SkinPersona {
        return this.personaData;
    }

    public getGeometry(): string {
        return this.geometry;
    }

    public getCape(): SkinCape {
        return this.cape;
    }
}
