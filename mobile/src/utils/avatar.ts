export const AVATAR_COLORS = [
    '#007AFF', '#5856D6', '#FF9500',
    '#34C759', '#FF2D55', '#AF52DE',
    '#00C7BE', '#FF6B35',
];

export function getInitials(name: string): string {
    return name
        .trim()
        .split(' ')
        .map((w) => w[0]?.toUpperCase() ?? '')
        .slice(0, 2)
        .join('');
}

export function colorForName(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
    return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}
