const mapDBToModelAlbum = ({
    id,
    name,
    year,
    cover_url,
    created_at,
    updated_at

}) => ({
    id,
    name,
    year,
    coverUrl: cover_url,
    createdAt: created_at,
    updatedAt: updated_at,
});

export { mapDBToModelAlbum };