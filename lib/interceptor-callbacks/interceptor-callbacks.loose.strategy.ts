import {
    Expressions, GetPropertyExpression, MethodExpression, NamedMethodExpression,
    SetPropertyExpression
} from '../expressions';
import {DefinedSetups} from '../defined-setups';
import {Tracker} from '../tracker';
import {IInterceptorCallbacksStrategy} from './interceptor-callbacks';

export class InterceptorCallbacksLooseStrategy<T> implements IInterceptorCallbacksStrategy {

    constructor(private definedSetups: DefinedSetups<T>,
                private tracker: Tracker) {

    }

    public intercepted(expression: Expressions): any {
        this.tracker.add(expression);
        const setup = this.definedSetups.get(expression);
        if (setup !== undefined) {
            if (expression instanceof MethodExpression)
                return setup.invoke((<MethodExpression>expression).arguments);
            if (expression instanceof NamedMethodExpression)
                return setup.invoke((<NamedMethodExpression>expression).arguments);
            if (expression instanceof SetPropertyExpression)
                return setup.invoke([(<SetPropertyExpression>expression).value]);

            return setup.invoke();
        }
        return undefined;
    }

    public hasNamedMethod(methodName: string, prototype: any): boolean {
        const getPropertyExpression = new GetPropertyExpression(methodName);
        const setup = this.definedSetups.get(getPropertyExpression);
        return setup !== undefined ? false : true;
    }
}