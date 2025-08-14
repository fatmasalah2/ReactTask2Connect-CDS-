export type JwtToken = {
    token: string;
    expiresIn: number;
    refreshToken: string;
    refreshExpiresIn: number;
    // de kul ma ye7tagu ltoken bta3i
};
export default function updateToken(token: JwtToken): Promise<JwtToken> {
    // lfunc de bta5ud object of type JwtToken
    // btrg3 promise btrg3 token gded be nfs lnu3
    return new Promise((resolve, reject) => {
        if (!token || !token.token || !token.refreshToken) {
            // ana hena bt2kd mn se7t el token bta3i
            // mmkn ybaa msh mwgud asln
            // kman lazem refresh token 34n d li by3ml lupdate
            return reject(new Error("Invalid token object"));
            // lw kda ybaa 3ndi mushkla fy lpromise bta3y
        }
        setTimeout(() => {
            // bnt25r shwyaa 1000
            resolve({
                // resolve ybaa kul haga tmm
                // rg3li ltoken
                ...token,
                expiresIn: token.expiresIn + 3600,
                refreshExpiresIn: token.refreshExpiresIn + 7200,
            });
        }, 1000);
    });
}
