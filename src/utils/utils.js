import React, { useState } from "react";

export const useForceUpdate = () => {
    const [value, set] = useState(true);
    return [value, () => set(!value)];
};
