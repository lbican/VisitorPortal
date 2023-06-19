export class HashColorGenerator {
    private static hashCode(s: string): number {
        let h = 0;
        for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;

        return h;
    }

    static getColor(s: string): string {
        const hash = HashColorGenerator.hashCode(s);
        const r = Math.abs(hash) % 256;
        const g = Math.abs(hash >> 8) % 256;
        const b = Math.abs(hash >> 16) % 256;
        return `rgba(${r}, ${g}, ${b}, 0.2)`;
    }

    // Function to generate border color based on string
    static getBorderColor(s: string): string {
        const color = this.getColor(s);
        return color.replace('0.2', '1');
    }
}
