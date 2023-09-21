
/**
 * Pads a list with strings so that flexbox displays of cards will align the last item.
 * 
 * @param original A list of objects that will be displayed.
 * @returns A list containing all of the objects in the original list, and placeholders if needed.
 */
export function padList(original: any[]): any[] {
    let listLength = original.length;
    var result = [...original] 
    if (listLength > 2){
        result.push("card-pad")
        result.push("card-pad")
        result.push("card-pad")
    }
    return result;
}